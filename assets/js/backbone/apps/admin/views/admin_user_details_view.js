var _ = require('underscore');
var Backbone = require('backbone');
var $ = require('jquery');
var MarkdownEditor = require('../../../components/markdown_editor');
var AdminUserDetailsTemplate = require('../templates/admin_user_details_template.html');
var Modal = require('../../../components/modal');

var AdminUserDetailstView = Backbone.View.extend({

  events: {
    'click .user-enable'          : 'toggleCheckbox',
    'click .sitewide-admin'         : 'toggleCheckbox',
    'click .sitewide-approver'      : 'toggleCheckbox',
  },

  initialize: function (options) {
    this.options = options;
    this.adminMainView = options.adminMainView;
    this.userId = options.userId || options.users[0].userId;
    this.user = {};
  },

  render: function (replace) {
    this.$el.show();
    this.loadUserDetailData();
    return this;
  },

  loadUserDetailData: function (replace) {
    $.ajax({
      url: '/api/admin/user/' + this.userId,
      dataType: 'json',
      success: function (userInfo) {
        this.user = userInfo.user;
        this.user.isAdministrator = this.isAdministrator;
        this.user.isApprover = this.isApprover;
        this.user.returnUrl = '/admin/users';
        var template = _.template(AdminUserDetailsTemplate)({ user: this.user }); 
        this.$el.html(template);
      }.bind(this),
    });
  },

  isAdministrator: function (user, target) {
    return (target == 'sitewide' && user.isAdmin) ||
      (target == 'agency' && user.isAgencyAdmin) ||
      (target == 'community' && user.is_manager);
  },

  isApprover: function (user, target) {
    return (target == 'sitewide' && user.is_approver) || (target == 'community' && user.is_approver);
  },

  toggleCheckbox: function (e) {
    if (e.preventDefault) e.preventDefault();
    var t = $(e.currentTarget);
    var id = this.user.id;
    var username = this.user.user-name;

    this.updateUser(t, {
      id: id,
      checked: t.prop('checked'),
      url: this.getUrlFor(id, t),
    });
    
  },

  updateUser: function (t, data) {
    var spinner = $($(t.parent()[0]).children('.icon-spin')[0]);
    // Show spinner and hide checkbox
    spinner.show();
    t.siblings('label').hide();
    if (data.url) {
      $.ajax({
        url: data.url,
        dataType: 'json',
        success: function (d) {
          // Hide spinner and show checkbox
          spinner.hide();
          t.siblings('label').show();
          t.prop('checked', data.checked);
        },
      });
    }
  },

  getUrlFor: function (id, elem) {
    switch (elem.data('action')) {
      case 'user':
        return '/api/user/' + (elem.prop('checked') ? 'enable' : 'disable') + '/' + id;
      case 'sitewide-admin':
        return '/api/admin/admin/' + id + '?action=' + elem.prop('checked');
      case 'sitewide-approver':
        return '/api/admin/approver/' + id + '?action=' + elem.prop('checked');
    }
  },

  cleanup: function () {
    removeView(this);
  },

});

module.exports = AdminUserDetailstView;
