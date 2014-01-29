(function(f, define){
    define([ "../../kendo.dataviz.core", "../util" ], f);
})(function(){

(function ($, undefined) {
    // Imports ================================================================
    var math = Math,
        max = math.max,
        min = math.min,

        kendo = window.kendo,
        Class = kendo.Class,

        dataviz = kendo.dataviz,
        deepExtend = kendo.deepExtend,

        util = dataviz.util,
        defined = util.defined,
        round = util.round,
        valueOrDefault = util.valueOrDefault;

    // Implementation =========================================================
    var Location = Class.extend({
        init: function(lat, lng) {
            if (arguments.length === 1) {
                this.lat = lat[0];
                this.lng = lat[1];
            } else {
                this.lat = lat;
                this.lng = lng;
            }
        },

        FORMAT: "{0:N6},{1:N6}",

        toArray: function() {
            return [this.lat, this.lng];
        },

        equals: function(loc) {
            return loc && loc.lat === this.lat && loc.lng === this.lng;
        },

        clone: function() {
            return new Location(this.lat, this.lng);
        },

        round: function(precision) {
            this.lng = round(this.lng, precision);
            this.lat = round(this.lat, precision);
            return this;
        },

        wrap: function() {
            this.lng = this.lng % 180;
            this.lat = this.lat % 90;
            return this;
        }
    });

    // IE < 9 doesn't allow to override toString on definition
    Location.fn.toString = function() {
        return kendo.format(this.FORMAT, this.lng, this.lat);
    };

    Location.fromLngLat = function(ll) {
        return new Location(ll[1], ll[0]);
    };

    Location.fromLatLng = function(ll) {
        return new Location(ll[0], ll[1]);
    };

    Location.create = function(a, b) {
        if (defined(a)) {
            if (a instanceof Location) {
                return a.clone();
            } else if (arguments.length === 1 && a.length === 2) {
                return Location.fromLatLng(a);
            } else {
                return new Location(a, b);
            }
        }
    };

    var Extent = Class.extend({
        init: function(nw, se) {
            nw = Location.create(nw);
            se = Location.create(se);

            if (nw.lng + 180 > se.lng + 180 &&
                nw.lat + 90 < se.lat + 90) {
                this.se = nw;
                this.nw = se;
            } else {
                this.se = se;
                this.nw = nw;
            }
        },

        contains: function(loc) {
            var nw = this.nw,
                se = this.se,
                lng = valueOrDefault(loc.lng, loc[1]),
                lat = valueOrDefault(loc.lat, loc[0]);

            return loc &&
                   lng + 180 >= nw.lng + 180 &&
                   lng + 180 <= se.lng + 180 &&
                   lat + 90 >= se.lat + 90 &&
                   lat + 90 <= nw.lat + 90;
        },

        center: function() {
            var nw = this.nw;
            var se = this.se;

            var lng = nw.lng + (se.lng - nw.lng) / 2;
            var lat = nw.lat + (se.lat - nw.lat) / 2;
            return new Location(lat, lng);
        },

        containsAny: function(locs) {
            var result = false;
            for (var i = 0; i < locs.length; i++) {
                result = result || this.contains(locs[i]);
            }

            return result;
        },

        include: function(loc) {
            var nw = this.nw,
                se = this.se,
                lng = valueOrDefault(loc.lng, loc[1]),
                lat = valueOrDefault(loc.lat, loc[0]);

            nw.lng = min(nw.lng, lng);
            nw.lat = max(nw.lat, lat);

            se.lng = max(se.lng, lng);
            se.lat = min(se.lat, lat);
        },

        includeAll: function(locs) {
            for (var i = 0; i < locs.length; i++) {
                this.include(locs[i]);
            }
        },

        edges: function() {
            var nw = this.nw,
                se = this.se;

            return {nw: this.nw, ne: new Location(nw.lat, se.lng),
                    se: this.se, sw: new Location(nw.lng, se.lat)};
        },

        toArray: function() {
            var nw = this.nw,
                se = this.se;

            return [nw, new Location(nw.lat, se.lng),
                    se, new Location(nw.lng, se.lat)];
        },

        overlaps: function(extent) {
            return this.containsAny(extent.toArray()) ||
                   extent.containsAny(this.toArray());
        }
    });

    Extent.World = new Extent([90, -180], [-90, 180]);

    Extent.create = function(a, b) {
        if (a instanceof Extent) {
            return a;
        } else if (a && b) {
            return new Extent(a, b);
        } else if (a && a.length === 4 && !b) {
            return new Extent([a[0], a[1]], [a[2], a[3]]);
        }
    };

    // Exports ================================================================
    deepExtend(dataviz, {
        map: {
            Extent: Extent,
            Location: Location
        }
    });

})(window.kendo.jQuery);

}, typeof define == 'function' && define.amd ? define : function(_, f){ f(); });
