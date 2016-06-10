///////////////////////////////////////////////////////////////////////////////
// ModelStructure viewer extension
// by Philippe Leefsma, March 2016
//
///////////////////////////////////////////////////////////////////////////////
AutodeskNamespace("Autodesk.ADN.Viewing.Extension");

Autodesk.ADN.Viewing.Extension.ModelStructure = function (viewer, options) {

  Autodesk.Viewing.Extension.call(this, viewer, options);

  var _self = this;

  ///////////////////////////////////////////////////////////////////
  //
  //
  ///////////////////////////////////////////////////////////////////
  _self.load = function() {

    console.log('Autodesk.ADN.Viewing.Extension.ModelStructure loaded');

    viewer.addEventListener(
      Autodesk.Viewing.CAMERA_CHANGE_EVENT,
      onCameraChanged);

    return true;
  }

  ///////////////////////////////////////////////////////////////////
  // A demo task
  //
  ///////////////////////////////////////////////////////////////////
  function hasPropertyTask(model, dbId, propName, matches) {

    return new Promise(function(resolve, reject){

      model.getProperties(dbId, function(result) {

        if(result.properties) {

          for (var i = 0; i < result.properties.length; ++i) {

            var prop = result.properties[i];

            //check if we have a match
            if (prop.displayName == propName) {

              var match = {
                dbId: dbId
              }

              match[propName] = prop.displayValue;

              matches.push(match);
            }
          }
        }

        return resolve();

      }, function() {

        return reject();
      });
    });
  }

  ///////////////////////////////////////////////////////////////////
  //
  //
  ///////////////////////////////////////////////////////////////////
  _self.unload = function () {

    console.log('Autodesk.ADN.Viewing.Extension.ModelStructure unloaded');
    return true;
  };

  ///////////////////////////////////////////////////////////////////
  // Recursively builds the model tree
  //
  ///////////////////////////////////////////////////////////////////
  function buildModelTree(model){

    //builds model tree recursively
    function _buildModelTreeRec(node){

      instanceTree.enumNodeChildren(node.dbId,
        function(childId) {

          node.children = node.children || [];

          var fragIds = []

          instanceTree.enumNodeFragments(childId,
            function(fragId) {
              fragIds.push(fragId)
            })

          var childNode = {
            name: instanceTree.getNodeName(childId),
            dbId: childId,
            fragIds: fragIds,
            parent: node.dbId
          };

          node.children.push(childNode);

          _buildModelTreeRec(childNode);
        });
    }

    //get model instance tree and root component
    var instanceTree = model.getData().instanceTree;

    var rootId = instanceTree.getRootId();

    var rootNode = {
      dbId: rootId,
      name: instanceTree.getNodeName(rootId)
    };

    _buildModelTreeRec(rootNode);

    return rootNode;
  }

  ///////////////////////////////////////////////////////////////////
  // Recursively execute task on model tree
  //
  ///////////////////////////////////////////////////////////////////
  function executeTaskOnModelTree(model, task) {

    var taskResults = [];

    function _executeTaskOnModelTreeRec(dbId){

      instanceTree.enumNodeChildren(dbId,
        function(childId) {

          taskResults.push(task(model, childId));

          _executeTaskOnModelTreeRec(childId);
        });
    }

    //get model instance tree and root component
    var instanceTree = model.getData().instanceTree;

    var rootId = instanceTree.getRootId();

    _executeTaskOnModelTreeRec(rootId);

    return taskResults;
  }

  function onCameraChanged() {

    viewer.removeEventListener(
      Autodesk.Viewing.CAMERA_CHANGE_EVENT,
      onCameraChanged);

    setTimeout(function(){

      viewer.addEventListener(
        Autodesk.Viewing.CAMERA_CHANGE_EVENT,
        onCameraChanged);
    }, 2000)

    var modelTree = buildModelTree(viewer.model);

    console.log(modelTree);
  }
}

Autodesk.ADN.Viewing.Extension.ModelStructure.prototype =
  Object.create(Autodesk.Viewing.Extension.prototype);

Autodesk.ADN.Viewing.Extension.ModelStructure.prototype.constructor =
  Autodesk.ADN.Viewing.Extension.ModelStructure;

Autodesk.Viewing.theExtensionManager.registerExtension(
  'Autodesk.ADN.Viewing.Extension.ModelStructure',
  Autodesk.ADN.Viewing.Extension.ModelStructure);
