var express = require('express');
var router = express.Router();
var arrIgnorePages = ['/', '/favicon.ico', '/pageNotFound', '/assets/css/bootstrap.min.css.map'];


/* Admin routes start */
router.get('/admin/login', function(req, res, next) {
  res.render('admin/pages/login', {
    title: "EpicPic | Admin login"
  });
});

router.get('/admin/dashboard', function (req, res, next) {
  res.render('admin/pages/dashboard', {
    title: "EpicPic | Dashboard"
  });
});

router.get('/admin/users', function (req, res, next) {
  res.render('admin/pages/users', {
    title: "EpicPic | Users"
  });
});

router.get('/admin/events', function (req, res, next) {
  res.render('admin/pages/events', {
    title: "EpicPic | Users"
  });
});

router.get('/admin/add-event', function (req, res, next) {
  res.render('admin/pages/addEvent', {
    title: "EpicPic | Add Event"
  });
});

/* Admin routes end */


/* website routes start */



/* website routes end */

// router.get('/pageNotFound', function(req, res, next) {
//   res.render('pages/others/pageNotFound', {
//     title: "404: Page not found",
//     objModules: []
//   });
// });

module.exports = router;

function commonRender(req, res, moduleName) {
  moduleName = (moduleName.indexOf('/') == 0 ? moduleName.substr(1, moduleName.length) : moduleName);
  var objRight = checkUserRights(req, moduleName);
  var objModules = getModuleName(req);
  if (objRight.length > 0 && objRight[0].canView == 1) {
    //get module name

    res.render('pages/' + moduleName + '/' + moduleName, {
      title: "Add " + moduleName + ": Nodejs Structure",
      canAddEdit: objRight[0].canAddEdit,
      canDelete: objRight[0].canDelete,
      objModules: objModules
    });
  } else {
    res.render('pages/others/pageNotFound', {
      title: "404: Page not found",
      objModules: objModules
    });
  }
}

function checkUserRights(req, moduleName) {
  var userRights = req.session.userInfo.userRights;
  var objRight = userRights.filter(function(obj) {
    return obj.moduleName.toLowerCase() == moduleName.toLowerCase();
  })
  return objRight;
}

function getModuleName(req) {
  var userRights = req.session.userInfo.userRights;
  var objModules = [];
  for (var i = 0; i < userRights.length; i++) {
    if (userRights[i].canView == 1 && userRights[i].adminCreated == 1) {
      objModules.push(userRights[i].moduleName);
    }
  }

  return objModules;
}
