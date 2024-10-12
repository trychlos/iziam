/*
 * /imports/group/components/groups_tree_panel/groups_tree_panel.js
 *
 * Groups tree.
 *
 * Parms:
 * - item: a ReactiveVar which contains the Organization
 * - checker: a ReactiveVar which contains the parent Forms.Checker
 * - groups: the list of groups for the organization
 */

import _ from 'lodash';

import { ReactiveVar } from 'meteor/reactive-var';

import './groups_tree_panel.html';

Template.groups_tree_panel.onCreated( function(){
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
        //  group = { name, scoped, children } and its id will be radical+group.name
        tree_create_ask( group, parent=null ){
            if( parent ){
                if( Object.keys( self.APP.tree_nodes_created ).includes( parent.name )){
                    self.APP.tree_create_node( group, parent );
                } else if( Object.keys( self.APP.tree_nodes_asked ).includes( parent.name )){
                    if( !Object.keys( self.APP.tree_nodes_waiting ).includes( parent.name )){
                        self.APP.tree_nodes_waiting[ parent.name ] = [];
                    }
                    self.APP.tree_nodes_waiting[ parent.name ].push( group );
                } else {
                    // if the parent has not been asked, then it is unknown here -> say it is null
                    self.APP.tree_create_node( group );
                }
            } else {
                self.APP.tree_create_node( group );
            }
        },

        // track the creation of nodes
        //  and run the creation of waiting children
        //  data = { node, parent, position, jsTree instance }
        tree_create_done( data ){
            const group = data.node.original.doc;
            self.APP.tree_nodes_created[ group.name ] = data.node;
            delete self.APP.tree_nodes_asked[ group.name ];
            if( Object.keys( self.APP.tree_nodes_waiting ).includes( group.name )){
                self.APP.tree_nodes_waiting[ group.name ].forEach(( child ) => {
                    self.APP.tree_create_ask( child, group );
                });
                delete self.APP.tree_nodes_waiting[ group.name ];
            }
            // when we have created all the nodes...
            if( Object.keys( self.APP.tree_nodes_waiting ).length === 0 ){
                self.APP.tree_built( true );
            }
        },

        // create a new node
        //  the caller has made sure the parent is available if not null
        tree_create_node( group, parent=null ){
            self.APP.tree_nodes_asked[group.name] = group;
            const parent_node = parent ? self.APP.tree_nodes_created[ parent.name ] : null;
            const $tree = self.APP.$tree.get();
            $tree.jstree( true ).create_node( parent_node, {
                "id": self.data.pr_prefix + group.name,
                "text": group.name,
                "children": [],
                "icon": false,
                "doc": group
            });
        },

        // delete a node
        //  a node has been deleted
        tree_delete_node( data ){
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

    // track the groups -> have to rebuild the tree on changes
    self.autorun(() => {
        const groups = Template.currentData().groups;
        if( !_.isEqual( groups, self.APP.prevTree )){
            self.APP.prevTree = _.cloneDeep( groups );
            self.APP.tree_built( false );
        }
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
    })
});

Template.groups_tree_panel.onRendered( function(){
    const self = this;

    // identify the tree node as soon as possible
    self.autorun(() => {
        let $tree = self.APP.$tree.get();
        if( !$tree ){
            $tree = self.$( '.c-groups-tree-panel .tree' );
            self.APP.$tree.set( $tree );
        }
    })

    // and build the tree
    self.autorun(() => {
        const $tree = self.APP.$tree.get();
        if( $tree ){
            $tree.jstree({
                core: {
                    check_callback( operation, node, node_parent, node_position, more ){
                        switch( operation ){
                            case 'create_node':
                            case 'delete_node':
                                return true;
                            default:
                                return false;
                        }
                    },
                    multiple: false
                },
                plugins: [
                    'wholerow'
                ]
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
            });
        }
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
            // display the group and its children
            async function f_group( group, parent=null ){
                self.APP.tree_create_ask.bind( self )( group, parent );
                if( group.children ){
                    group.children.forEach(( it ) => {
                        promises.push( f_group( it, group ));
                    });
                }
            }
            groups.forEach( async ( it ) => {
                promises.push( f_group( it ));
            });
            Promise.allSettled( promises ).then(() => {
                self.APP.tree_populated( false );
            });
        }
    });

    // at the end of the nodes creation, update the display
    //  populate the built tree with actual groups of the user by checking already created checkboxes
    //  send once pr-change event at the end of the task
    /*
    self.autorun(() => {
        const groups = Template.currentData().groupsRegistrar.get();
        if( self.APP.tree_built() && !self.APP.tree_populated()){
            //console.debug( 'populating with', groups.global.direct );
            self.APP.triggerChangeEvent = false;
            const $tree = self.APP.$tree.get();
            self.APP.tree_populated( true );
            self.APP.triggerChangeEvent = true;
            // send a pr-change on the tree to leave the status indicator a chance to auto-update
            $tree.trigger( 'pr-change' );
        }
    });
    */
});

/*
Template.groups_tree_panel.events({
    'pr-delete .pr-tree'( event, instance ){
        //console.debug( 'deleting pr-tree' );
        const $tree = instance.APP.$tree.get();
        if( $tree ){
            $tree.jstree( true ).destroy();
            instance.APP.$tree.set( null );
        }
    }
});
*/
