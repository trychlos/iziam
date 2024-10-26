/*
 * /imports/group/components/groups_tree/groups_tree.js
 *
 * Groups tree.
 * NB: while Roles tree are driven by children, this one is driven by parent. This is slightly different in the final code.
 *
 * Parms:
 * - item: a ReactiveVar which contains the Organization as an entity with its DYN.records array
 * - checker: a ReactiveVar which contains the parent Forms.Checker
 * - groups: the groups of the organization
 * - editable: whether the tree is editable, defaulting to true
 *   here, 'editable' means that we allow dnd, so change the tree
 * - withCheckboxes: whether the tree has checkboxes, defaulting to true
 * - withIdentities: whether to display the identities, defaulting to true
 * - selected: an array of the checkboxes to check, only considered if withCheckboxes is truethy
 * - noDataText: the text to be displayed when there is no data, defaulting to "There is not yet any group defined for the organization. Please edit the groups hierarchy tree."
 */

import _ from 'lodash';

import { pwixI18n } from 'meteor/pwix:i18n';
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
        tree_populated_rv: new ReactiveVar( false ),
        tree_checked_rv: new ReactiveVar( false ),

        // whether the tree is readonly
        editable: new ReactiveVar( true ),
        // whether the tree has checkboxes
        withCheckboxes: new ReactiveVar( true ),
        // whether to display the identities
        withIdentities: new ReactiveVar( true ),

        // the previous version of tree data
        prevData: null,

        // whether trigger pr-change event
        //  doesn't trigger the event when checkboxes are programatically checked
        triggerChangeEvent: true,

        // this function returns the whole tree of node.original.doc whith the children updated
        //  written to be callable from anywhere (and advertised to others when the tree is ready)
        // the caller may pass a function to be called on each document
        // if withCheckboxes is truethy, we add 'DYN.checked' and 'DYN.enabled' attributes to each document
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
                    if( self.APP.withCheckboxes.get()){
                        doc.DYN = doc.DYN || {};
                        doc.DYN.checked = node.state.checked;
                        doc.DYN.enabled = !node.state.disabled;
                    }
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

        // we have explicitely or programatically checked an item
        // cascade is automatically handled by jsTree when the user checks a checkbox, *not* when we call check_node()
        //  data = { node, selected, event, jsTree instance }
        tree_checkbox_check( data ){
            const $tree = self.APP.$tree.get();
            //console.debug( data.node );
            for( let i=0 ; i<data.node.parents.length-1 ; ++i ){
                $tree.jstree( true ).check_node( data.node.parents[i] );
                $tree.jstree( true ).disable_node( data.node.parents[i] );
            }
            $tree.trigger( 'tree-check' );
        },

        // we have explicitely or programatically unchecked an item
        // only uncheck the parents if there is no other selected nodes in this level for this parent
        //  data = { node, selected, event, jsTree instance }
        tree_checkbox_uncheck( data ){
            const $tree = self.APP.$tree.get();
            // get besides nodes but not this one
            const parent_node = $tree.jstree( true ).get_node( data.node.parent );
            if( parent_node ){
                let haveChecked = false;
                let besides = [];
                parent_node.children.forEach(( it ) => {
                    if( it !== data.node.id ){
                        besides.push( it );
                    }
                })
                for( let i=0 ; i<besides.length ; ++i ){
                    const node = $tree.jstree( true ).get_node( besides[i] );
                    if( node && node.state.checked ){
                        haveChecked = true;
                        break;
                    }
                }
                if( !haveChecked ){
                    for( let i=0 ; i<data.node.parents.length-1 ; ++i ){
                        $tree.jstree( true ).uncheck_node( data.node.parents[i] );
                        $tree.jstree( true ).enable_node( data.node.parents[i] );
                    }
                }
            }
            $tree.trigger( 'tree-check' );
        },

        // ask for create a new node for the tree
        //  if not null, wait for the parent be available
        //  group = { type, label, children } and its id will be group._id
        //  parent = parent identifier
        tree_create_ask( group, parent=null ){
            if( parent ){
                if( Object.keys( self.APP.tree_nodes_created ).includes( parent )){
                    self.APP.tree_create_node( group, parent );
                } else {
                    if( !Object.keys( self.APP.tree_nodes_waiting ).includes( parent )){
                        self.APP.tree_nodes_waiting[ parent ] = [];
                    }
                    self.APP.tree_nodes_waiting[ parent ].push( group );
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
            self.APP.tree_nodes_created[ group._id ] = data.node;
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
                self.APP.tree_populated( true );
            }
        },

        // create a new node
        //  the caller has made sure the parent is available if not null
        tree_create_node( group, parent=null ){
            if( group.type !== 'I' || self.APP.withIdentities.get()){
                self.APP.tree_nodes_asked[group._id] = group;
                const parent_node = parent ? self.APP.tree_nodes_created[ parent ] : null;
                const $tree = self.APP.$tree.get();
                $tree.jstree( true ).create_node( parent_node, {
                    "id": group._id,
                    "text": group.label || group.DYN?.label,
                    "children": [],
                    "doc": group,
                    "type": group.type
                });
            }
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
        // more.dnd: true
        // more.pos = a (after), b (before) or i (inside)
        // + identities can only gio inside a group
        tree_dnd_move_check( node, node_parent, node_position, more ){
            return node.parent !== node_parent.id &&
                ( node.type !== 'I' || node_parent.type === 'G' );
        },

        // dnd stop: open the (new) parent
        tree_dnd_stop( event, data ){
            const $tree = self.APP.$tree.get();
            console.debug( '$tree.jstree( true )', $tree.jstree( true ));
            const moved = $tree.jstree( true ).get_node( data.element );
            const closest = data.event.target.closest( 'a.jstree-anchor' );
            //const target_node = $tree.jstree( true ).get_node( closest ); // works but useless
            $tree.jstree( true ).open_node( closest );
        },

        // getter/setter: whether the creation of the tree is done
        tree_built( done ){
            if( done === true || done === false ){
                self.APP.tree_built_rv.set( done );
            }
            return self.APP.tree_built_rv.get();
        },

        // getter/setter: whether the initial checkboxes have been checked
        tree_checked( done ){
            if( done === true || done === false ){
                self.APP.tree_checked_rv.set( done );
            }
            return self.APP.tree_checked_rv.get();
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

    // whether the tree is editable, defaulting to true
    self.autorun(() => {
        const editable = Template.currentData().editable !== false;
        self.APP.editable.set( editable );
    });

    // whether the tree has checkboxes, defaulting to true
    self.autorun(() => {
        const withCheckboxes = Template.currentData().withCheckboxes !== false;
        self.APP.withCheckboxes.set( withCheckboxes );
    });

    // whether to display the identities, defaulting to true
    self.autorun(() => {
        const withIdentities = Template.currentData().withIdentities !== false;
        self.APP.withIdentities.set( withIdentities );
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
                'conditionalselect',
                'sort',
                'types',
                'wholerow'
            ];
            if( self.APP.editable.get()){
                plugins.push( 'dnd' );
            }
            if( self.APP.withCheckboxes.get()){
                plugins.push( 'checkbox' );
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
                checkbox: {
                    three_state: false,
                    whole_node: true,
                    tie_selection: false
                },
                conditionalselect( node, event ){
                    return self.APP.editable.get();
                },
                dnd: {
                    copy: false,
                    open_timeout: 250
                },
                sort: function( a, b ){
                    const node_a = this.get_node( a );
                    const node_b = this.get_node( b );
                    const type = node_a.type > node_b.type ? 1 : ( node_a.type < node_b.type ? -1 : 0 );
                    const label_a = String( node_a.text ).toString().toUpperCase();
                    const label_b = String( node_b.text ).toString().toUpperCase();
                    return type ? type : ( label_a > label_b ? 1 : ( label_a < label_b ? -1 : 0 ));
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
            // 'select_node.jstree' data = { node, jsTree instance }
            .on( 'select_node.jstree', ( event, { event2, instance, node, selected }) => {
                self.$( '.c-groups-tree' ).trigger( 'tree-rowselect', { node: node });
            })
            // 'deselect_node.jstree' data = { node, jsTree instance }
            // pwi 2024-10-14 doesn't know when this event is sent as doesn't log
            .on( 'deselect_node.jstree', ( event, data ) => {
                console.debug( event.type );
                self.$( '.c-groups-tree' ).trigger( 'tree-rowselect', { node: null });
            });
        }
    });
    // dnd events are only triggered on the document
    $( document )
        .on( 'dnd_move.vakata', ( event, { data, element, event2, helper }) => {
            self.APP.tree_dnd_move( event, data, element, helper );
        })
        //.on( 'dnd_stop.vakata', ( event, { data, element, event2, helper }) => {
        .on( 'dnd_stop.vakata', ( event, data ) => {
            self.APP.tree_dnd_stop( event, data );
        });

    // build the groups tree
    //  displaying the groups hierarchy
    self.autorun(() => {
        const $tree = self.APP.$tree.get();
        const groups = Template.currentData().groups;
        if( !_.isEqual( groups, self.APP.prevData) && $tree && self.APP.tree_ready()){
            // keep the tree data
            self.APP.prevData = _.cloneDeep( groups );
            // reset the tree
            console.debug( 'reset the tree' );
            $tree.jstree( true ).delete_node( Object.values( self.APP.tree_nodes_created ));
            self.APP.tree_nodes_asked = {};
            self.APP.tree_nodes_created = {};
            self.APP.tree_nodes_waiting = {};
            self.APP.tree_populated( false );
            // and rebuild it
            console.debug( 'rebuild the tree' );
            let promises = [];
            // display the group/identity item, attaching it to its parent
            groups.forEach( async ( it ) => {
                promises.push( self.APP.tree_create_ask.bind( self )( it, it.parent ));
            });
        }
    });

    // when the tree is ready, advertise of the get function
    self.autorun(() => {
        if( self.APP.tree_ready()){
            self.$( '.c-groups-tree' ).trigger( 'tree-fns', { fnGet: self.APP.getTree });
        }
    });

    // when the tree has been populated, open all nodes
    self.autorun(() => {
        if( self.APP.tree_populated()){
            self.APP.$tree.get().jstree( true ).open_all();
        }
    });

    // if we have checkboxes, then check them
    self.autorun(() => {
        //console.debug( 'populated', self.APP.tree_populated(), 'withCheckboxes', self.APP.withCheckboxes.get(), 'checked', self.APP.tree_checked(), 'selected', Template.currentData().selected );
        if( self.APP.tree_populated() && self.APP.withCheckboxes.get() && !self.APP.tree_checked()){
            ( Template.currentData().selected || [] ).forEach(( it ) => {
                self.APP.$tree.get().jstree( true ).check_node( it );
            });
        }
    });
});

Template.groups_tree.helpers({
    // whether the close_all button is enabled ?
    closeButtonDisabled(){
        return this.groups && this.groups.length > 0 ? '' : 'disabled';
    },

    // show when there is data
    showIfData(){
        return this.groups && this.groups.length > 0 ? 'ui-dblock' : 'ui-dnone';
    },

    // show when there is no data
    showIfEmpty(){
        return this.groups && this.groups.length > 0 ? 'ui-dnone' : 'ui-dblock';
    },

    // whether the user may choose to show identities ?
    haveShowIdentitiesButton(){
        return false;// Template.instance().APP.withIdentities.get();
    },

    // whether the identities chooser is enabled ?
    identitiesButtonDisabled(){
        return this.groups && this.groups.length > 0 ? '' : 'disabled';
    },

    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // text when there is no data
    noDataContent(){
        return this.noDataText || pwixI18n.label( I18N, 'groups.tree.no_data_one' );
    },

    // whether the open_all button is enabled ?
    openButtonDisabled(){
        return this.groups && this.groups.length > 0 ? '' : 'disabled';
    },
});

Template.groups_tree.events({
    // show/hide the identities
    'click .js-show'( event, instance ){
        return false;
    },

    // close all nodes
    'click .js-close'( event, instance ){
        instance.APP.$tree.get().jstree( true ).close_all();
        return false;
    },

    // open all nodes
    'click .js-open'( event, instance ){
        instance.APP.$tree.get().jstree( true ).open_all();
        return false;
    },

    // the user has clicked on 'remove item' button on the companion buttons component
    // the parent panel relays that by triggering this event
    'tree-remove-node .c-groups-tree'( event, instance, data ){
        instance.APP.$tree.get().jstree( true ).delete_node( data.node._id );
    }
});
