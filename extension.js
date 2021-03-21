const St = imports.gi.St;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const Lang = imports.lang;
const GLib = imports.gi.GLib;
const Me = imports.misc.extensionUtils.getCurrentExtension();
const Util = imports.misc.util;

const PROFILE_DIR = '/.tlp/';
		
const TLPButton = new Lang.Class({
	Name: 'TLPButton.button',
	Extends: PanelMenu.Button,
	
	_init: function() {
		this.parent(0.0, 'TLP Switcher');
		
		// panel icon
		
		this.actor.add_actor(
			new St.Icon({
				icon_name: 'applications-science-symbolic',
				style_class: 'system-status-icon'
			}));
			
		// popup menu title
		
		let itemTitle = new PopupMenu.PopupMenuItem('TLP Profile');
		itemTitle.actor.reactive = false;
		
		let menuTitle = new PopupMenu.PopupMenuSection();
		menuTitle.addMenuItem(itemTitle);
		
		this.menu.addMenuItem(menuTitle);
		this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
		
		// popup menu profiles
		
		this._menuProfiles = new PopupMenu.PopupMenuSection();
		this.menu.addMenuItem(this._menuProfiles);
		
		this._itemProfiles = null;
		this._profileDir = GLib.get_home_dir() + PROFILE_DIR;
	},
	
	_onOpenStateChanged: function(menu, open) {
		if (open)
			this._updateProfiles();
			
		this.parent(menu, open);
	},
	
	_updateProfiles: function() {

		// clear existing
		
		this._menuProfiles.removeAll();
		
		// list profiles
	
		let output = GLib.spawn_command_line_sync('ls ' + this._profileDir);
		this._profiles = output[1].toString().split('\n');
		this._profiles.pop();
		
		// create directory if it doesn't exist
		
		if (output[2].toString().indexOf('No such file or directory') != -1) 
			GLib.spawn_command_line_async('mkdir ' + this._profileDir);
		
		let len = this._profiles.length;
		if (len > 0) {
		
			// construct profiles menu
			
			this._itemProfiles = [];
			let p;
			for (let i = 0; i < len; ++i) {
				p = new PopupMenu.PopupMenuItem(this._profiles[i]);
				p.id = i;
				p.connect('activate', Lang.bind(this, function(actor, event) {
					this._activate(actor.id);
				}));
				
				this._itemProfiles[i] = p;
				this._menuProfiles.addMenuItem(p);
			}
			
			// determine current profile
			
			this._checkActive();
		}
		else {
		
			// no profiles
		
			let item = new PopupMenu.PopupMenuItem('No profiles in ~/.tlp');
			item.actor.reactive = false;
			this._menuProfiles.addMenuItem(item);
		}
	},
	
	_activate: function(index) {
		
		// update active ornament
		
		for (let i = 0; i < this._itemProfiles.length; ++i)
			this._itemProfiles[i].setOrnament(PopupMenu.Ornament.NONE);
		this._itemProfiles[index].setOrnament(PopupMenu.Ornament.DOT);
		
		// run tlp update script
		// (cp script /etc/default/tlp && tlp start)
		
		let script = Me.dir.get_path() + '/tlp_update.sh';
		let [parsed, args] = 
			GLib.shell_parse_argv('/usr/bin/pkexec /bin/bash '.concat(script, ' \'', this._profileDir, this._profiles[index], '\''));
		if (parsed)
			Util.spawn(args);
	},
	
	_checkActive: function() {
		if (this._profiles.length == 0)
			return;
			
		let config = GLib.spawn_command_line_sync('tlp-stat -c')[1].toString().split('\n');
		let profile;
		
		for (let i = 0; i < this._profiles.length; ++i) {
			profile = GLib.spawn_command_line_sync('cat \''.concat(this._profileDir, this._profiles[i], '\''))[1].toString().split('\n');
			
			if (this._profileMatch(config, profile)) {
				this._itemProfiles[i].setOrnament(PopupMenu.Ornament.DOT);
				break;
			}
		}
	},
	
	_profileMatch: function(config, profile) {
	
		let stripDefaultsFromConfig = function (config)
		{
			const regex = new RegExp('(^.*L[0-9]{4}: )|(")|(^ *)|( *$)','g');

			let nonDefaults = [];
			for (let i = 0; i < config.length; i++) {
				let line = config[i];
				
				// ignore any default values, comments or empty lines
				if (line.startsWith('defaults.conf') || line.startsWith('-') || line.startsWith('+') || line.match(/^ *$/) || line.startsWith('#')) {
					continue;
				}

				nonDefaults.push(line.replace(regex, ''));
			}

			return nonDefaults.sort();
		}

		// strip any unnecessary information before comparison
		config = stripDefaultsFromConfig(config);
		profile = stripDefaultsFromConfig(profile);
	
		if (config.length !== profile.length)
		{
			return false;
		}
	
		if (config.every((v,i) => v === profile[i]))
		{
			return true;
		}
		
		return false;
	}
});

function init() {}

let button;

function enable() {
	button = new TLPButton;
	Main.panel.addToStatusArea('ID-TLPSwitcher', button);
}

function disable() {
	button.destroy();
}

