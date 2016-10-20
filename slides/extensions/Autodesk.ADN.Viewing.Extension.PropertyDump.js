///////////////////////////////////////////////////////////////////////////////
// PropertyDump viewer extension
// by Philippe Leefsma, October 2015
//
///////////////////////////////////////////////////////////////////////////////
AutodeskNamespace("Autodesk.ADN.Viewing.Extension");

Autodesk.ADN.Viewing.Extension.PropertyDump = function (viewer, options) {

    Autodesk.Viewing.Extension.call(this, viewer, options);

    var _self = this;

    /////////////////////////////////////////////////////////////////
    //
    //
    /////////////////////////////////////////////////////////////////
    _self.load = function () {

        viewer.addEventListener(
          Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT,
          onSelectionChanged);

        console.log('Autodesk.ADN.Viewing.Extension.PropertyDump loaded');

        return true;
    };

    /////////////////////////////////////////////////////////////////
    //
    //
    /////////////////////////////////////////////////////////////////
    _self.unload = function () {

        viewer.removeEventListener(
          Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT,
          onSelectionChanged);

        console.log('Autodesk.ADN.Viewing.Extension.PropertyDump unloaded');

        return true;
    };

    /////////////////////////////////////////////////////////////////
    //
    //
    /////////////////////////////////////////////////////////////////
    function onSelectionChanged(event) {

        if(event.selections.length > 0){

            var selection = event.selections[0]

            selection.dbIdArray.forEach(function(dbId) {

              dumpProperties(dbId);
            });
        }
    }

    /////////////////////////////////////////////////////////////////
    //
    //
    /////////////////////////////////////////////////////////////////
    function dumpProperties(dbId) {

        function _cb(result) {

            if (result.properties) {

                for (var i = 0; i < result.properties.length; i++) {

                    var prop = result.properties[i];

                    console.log(prop);
                }
            }
        }

        viewer.model.getProperties(dbId, _cb);
    }
};

Autodesk.ADN.Viewing.Extension.PropertyDump.prototype =
    Object.create(Autodesk.Viewing.Extension.prototype);

Autodesk.ADN.Viewing.Extension.PropertyDump.prototype.constructor =
    Autodesk.ADN.Viewing.Extension.PropertyDump;

Autodesk.Viewing.theExtensionManager.registerExtension(
    'Autodesk.ADN.Viewing.Extension.PropertyDump',
    Autodesk.ADN.Viewing.Extension.PropertyDump);

