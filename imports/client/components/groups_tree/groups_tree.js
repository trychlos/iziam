/*
 * /imports/group/components/groups_tree/groups_tree.js
 *
 * Groups tree.
 * NB: while Roles tree are driven by children, this one is driven by parent. This is slightly different in the final code.
 *
 * Parms:
 * - item: a ReactiveVar which contains the Organization
 * - checker: a ReactiveVar which contains the parent Forms.Checker
 * - groups: the list of groups for the organization
 * - editable: whether the tree is editable, defaulting to true
 */

import _ from 'lodash';

import { ReactiveVar } from 'meteor/reactive-var';

import { GroupType } from '/imports/common/definitions/group-type.def.js';

import './groups_tree.html';

Template.groups_tree.onCreated( function(){
    const self = this;
    //console.debug( this );

    self.APP = {
        // tree loading vars
        $tree: new ReactiveVar( null ),
        tree_ready_rv: new ReactiveVar( false ),
        tree_nodes_asked: {},
        tree_nodes_created: {},
        tree_nodes_waiting: {},
        tree_built_rv: new ReactiveVar( false ),
        tree_populated_rv: new ReactiveVar( false ),

        // whether the tree is readonly
        readOnly: new ReactiveVar( false ),

        // last built and populated tree
        prevTree: null,

        // whether trigger pr-change event
        //  doesn't trigger the event when checkboxes are programatically checked
        triggerChangeEvent: true,

        // this function returns the whole tree of node.original.doc whith the children updated
        //  written to be callable from anywhere (and advertised to others when the tree is ready)
        // the caller may pass a function to be called on each document
        getTree( fnDoc ){
            let tree = [];
            const $tree = self.APP.$tree.get();
            const root = $tree.jstree( true ).get_node( '#' );
            const recfn = function( nodeId, array ){
                const node = $tree.jstree( true ).get_node( nodeId );
                if( node ){
                    let doc = node.original.doc;
                    if( fnDoc ){
                        fnDoc( doc );
                    }
                    doc.children = [];
                    array.push( doc );
                    if( node.children ){
                        node.children.forEach(( id ) => {
                            recfn( id, doc.children );
                        });
                    }
                } else {
                    console.warn( 'node not found', nodeId );
                }
            }
            if( root ){
                root.children.forEach(( id ) => {
                    recfn( id, tree );
                });
            } else {
                console.warn( 'root not found' );
            }
            return tree;
        },

        // we have explicitely or programatically checked an item (but cascade doesn't come here)
        //  data = { node, selected, event, jsTree instance }
        tree_checkbox_check( data ){
            const $tree = self.APP.$tree.get();
            data.node.children_d.every(( id ) => {
                $tree.jstree( true ).disable_node( id );
                return true;
            });
            if( self.APP.triggerChangeEvent ){
                //console.debug( 'triggering pr-change due to checkbox check' );
                $tree.trigger( 'pr-change' );
            }
        },

        // we have explicitely or programatically unchecked an item (but cascade doesn't come here)
        //  data = { node, selected, event, jsTree instance }
        tree_checkbox_uncheck( data ){
            const $tree = self.APP.$tree.get();
            data.node.children_d.forEach(( id ) => {
                $tree.jstree( true ).enable_node( id );
            });
            //console.debug( 'triggering pr-change due to checkbox uncheck' );
            $tree.trigger( 'pr-change' );
        },

        // ask for create a new node for the tree
        //  if not null, wait for the parent be available
        //  group = { type, label, children } and its id will be group._id
        //  parent = parent identifier
        tree_create_ask( group, parent=null ){
            if( parent ){
                if( Object.keys( self.APP.tree_nodes_created ).includes( parent )){
                    console.debug( 'node under created parent', group, parent );
                    self.APP.tree_create_node( group, parent );
                } else {
                    if( !Object.keys( self.APP.tree_nodes_waiting ).includes( parent )){
                        self.APP.tree_nodes_waiting[ parent ] = [];
                    }
                    console.debug( 'parent is not created, so waiting', group, parent );
                    self.APP.tree_nodes_waiting[ parent ].push( group );
                }
            } else {
                console.debug( 'node at root', group );
                self.APP.tree_create_node( group );
            }
        },

        // track the creation of nodes
        //  and run the creation of waiting children
        //  data = { node, parent, position, jsTree instance }
        tree_create_done( data ){
            const group = data.node.original.doc;
            self.APP.tree_nodes_created[ group._id ] = data.node;
            console.debug( 'created', group );
            delete self.APP.tree_nodes_asked[ group._id ];
            // dealing with waiting for this parent
            if( Object.keys( self.APP.tree_nodes_waiting ).includes( group._id )){
                self.APP.tree_nodes_waiting[ group._id ].forEach(( child ) => {
                    self.APP.tree_create_ask( child, group._id );
                });
                delete self.APP.tree_nodes_waiting[ group._id ];
            }
            // when we have created all the nodes...
            if( Object.keys( self.APP.tree_nodes_waiting ).length === 0 ){
                self.APP.tree_built( true );
            }
        },

        // create a new node
        //  the caller has made sure the parent is available if not null
        tree_create_node( group, parent=null ){
            console.debug( 'creating', group );
            self.APP.tree_nodes_asked[group._id] = group;
            const parent_node = parent ? self.APP.tree_nodes_created[ parent ] : null;
            const $tree = self.APP.$tree.get();
            $tree.jstree( true ).create_node( parent_node, {
                "id": group._id,
                "text": group.label,
                "children": [],
                "doc": group,
                "type": group.type
            });
        },

        // delete a node
        //  a node has been deleted
        tree_delete_node( data ){
        },

        // dnd move in progress
        tree_dnd_move( event, data, element, helper ){
        },

        // check_callback function for dnd_move
        // we do not allow reordering, which implies that dnd must change the parent
        tree_dnd_move_check( node, node_parent, node_position, more ){
            return node.parent !== node_parent.id;
        },

        // dnd stop: open the (new) parent
        tree_dnd_stop( event, data, element, helper ){
            const $tree = self.APP.$tree.get();
            //console.debug( 'data', data );
            const moved = $tree.jstree( true ).get_node( data.obj );
            $tree.jstree( true ).open_node( moved.parent );
        },

        // getter/setter: whether the creation of the tree is done
        tree_built( done ){
            if( done === true || done === false ){
                self.APP.tree_built_rv.set( done );
            }
            return self.APP.tree_built_rv.get();
        },

        // getter/setter: whether the tree has been populated
        tree_populated( done ){
            if( done === true || done === false ){
                self.APP.tree_populated_rv.set( done );
            }
            return self.APP.tree_populated_rv.get();
        },

        // getter/setter: whether the tree is ready
        tree_ready( ready ){
            if( ready === true || ready === false ){
                self.APP.tree_ready_rv.set( ready );
            }
            return self.APP.tree_ready_rv.get();
        }
    };

    // whether the tree is editable
    self.autorun(() => {
        const editable = Template.currentData().editable !== false;
        self.APP.readOnly.set( !editable );
    });

    // track the groups -> have to rebuild the tree on changes
    self.autorun(() => {
        const groups = Template.currentData().groups;
        if( !_.isEqual( groups, self.APP.prevTree )){
            self.APP.prevTree = _.cloneDeep( groups );
            self.APP.tree_built( false );
        }
    });

    // track the ready status
    self.autorun(() => {
        //console.debug( 'tree_ready', self.APP.tree_ready());
    });

    // track the built status
    self.autorun(() => {
        //console.debug( 'tree_built', self.APP.tree_built());
    });

    // track the populated status
    self.autorun(() => {
        //console.debug( 'tree_populated', self.APP.tree_populated());
    });

    // track the groups list
    self.autorun(() => {
        //console.debug( 'groups', Template.currentData().groups );
    });

    // if the tree is editable, attach a selected() function to groups list
    self.autorun(() => {
        if( !self.APP.readOnly.get()){
            let groups = Template.currentData().groups;
            if( groups && !groups.selected ){
                groups.selected = function(){
                    return({ item: 'me', other: 'other' });
                }
            }
        }
    });
});

Template.groups_tree.onRendered( function(){
    const self = this;

    // identify the tree node as soon as possible
    self.autorun(() => {
        let $tree = self.APP.$tree.get();
        if( !$tree ){
            $tree = self.$( '.c-groups-tree .tree' );
            self.APP.$tree.set( $tree );
        }
    })

    // and build the tree
    self.autorun(() => {
        const $tree = self.APP.$tree.get();
        if( $tree ){
            let typesDefs = {};
            GroupType.Knowns().forEach(( it ) => {
                typesDefs[GroupType.id( it )] = {
                    icon: GroupType.icon( it )
                };
            });
            let plugins = [
                'sort',
                'types',
                'wholerow'
            ];
            if( !self.APP.readOnly.get()){
                plugins.push( 'dnd' );
            }
            $tree.jstree({
                core: {
                    check_callback( operation, node, node_parent, node_position, more ){
                        switch( operation ){
                            case 'create_node':
                            case 'delete_node':
                                return true;
                            case 'move_node':
                                return self.APP.tree_dnd_move_check( node, node_parent, node_position, more );
                            default:
                                return false;
                        }
                    },
                    multiple: false
                },
                plugins: plugins,
                dnd: {
                    copy: false,
                    open_timeout: 250
                },
                sort: function( a, b ){
                    const node_a = this.get_node( a );
                    const node_b = this.get_node( b );
                    const type = node_a.type > node_b.type ? 1 : ( node_a.type < node_b.type ? -1 : 0 );
                    return type ? type : ( node_a.text > node_b.text ? 1 : ( node_a.text < node_b.text ? -1 : 0 ));
                },
                types: typesDefs
            })
            // 'ready.jstree' data = jsTree instance
            .on( 'ready.jstree', ( event, data ) => {
                self.APP.tree_ready( true );
            })
            // 'create_node.jstree' data = { node, parent, position, jsTree instance }
            .on( 'create_node.jstree', ( event, data ) => {
                self.APP.tree_create_done( data );
            })
            // 'check_node.jstree' data = { node, selected, event, jsTree instance }
            .on( 'check_node.jstree', ( event, data ) => {
                self.APP.tree_checkbox_check( data );
            })
            // 'uncheck_node.jstree' data = { node, selected, event, jsTree instance }
            .on( 'uncheck_node.jstree', ( event, data ) => {
                self.APP.tree_checkbox_uncheck( data );
            })
            // 'delete_node.jstree' data = { node, parent, jsTree instance }
            .on( 'delete_node.jstree', ( event, data ) => {
                self.APP.tree_delete_node( data );
            })
            // 'enable_checkbox.jstree' data = { node, jsTree instance }
            .on( 'enable_node.jstree', ( event, data ) => {
                $tree.jstree( true ).get_node( data.node.id, true ).removeClass( 'pr-disabled' );
            })
            // 'disable_checkbox.jstree' data = { node, jsTree instance }
            .on( 'disable_node.jstree', ( event, data ) => {
                $tree.jstree( true ).get_node( data.node.id, true ).addClass( 'pr-disabled' );
            })
            // 'enable_checkbox.jstree' data = { node, jsTree instance }
            .on( 'select_node.jstree', ( event, { event2, instance, node, selected }) => {
                self.$( '.c-groups-tree' ).trigger( 'tree-rowselect', { node: node });
            })
            // 'enable_checkbox.jstree' data = { node, jsTree instance }
            .on( 'deselect_node.jstree', ( event, data ) => {
                self.$( '.c-groups-tree' ).trigger( 'tree-rowselect', { node: null });
            });
        }
    });
    // dnd events are only triggered on the document
    $( document )
        .on( 'dnd_move.vakata', ( event, { data, element, event2, helper }) => {
            self.APP.tree_dnd_move( event, data, element, helper );
        })
        .on( 'dnd_stop.vakata', ( event, { data, element, event2, helper }) => {
            self.APP.tree_dnd_stop( event, data, element, helper );
        });

    // build the groups tree
    //  displaying the groups hierarchy
    self.autorun(() => {
        const $tree = self.APP.$tree.get();
        const groups = Template.currentData().groups;
        if( $tree && self.APP.tree_ready() && !self.APP.tree_built()){
            // reset the tree
            //console.debug( 'reset and rebuild the tree' );
            $tree.jstree( true ).delete_node( Object.values( self.APP.tree_nodes_created ));
            self.APP.tree_nodes_asked = {};
            self.APP.tree_nodes_created = {};
            self.APP.tree_nodes_waiting = {};
            // and rebuild it
            //console.debug( 'rebuild the tree' );
            let promises = [];
            // display the group/identity item, attaching it to its parent
            groups.forEach( async ( it ) => {
                promises.push( self.APP.tree_create_ask.bind( self )( it, it.parent ));
            });
            Promise.allSettled( promises ).then(() => {
                self.APP.tree_populated( false );
            });
        }
    });

    // when the tree is ready, advertise of a get function
    self.autorun(() => {
        if( self.APP.tree_ready()){
            self.$( '.c-groups-tree' ).trigger( 'tree-fns', { fnGet: self.APP.getTree });
        }
    })
});
