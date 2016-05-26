function generateUUID(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};

// Convert GUID string to Base-64 in Javascript
// by Mark Seecof, 2012-03-31
var hexlist = '0123456789abcdef';
var b64list = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

// GUID string with four dashes is always MSB first,
// but base-64 GUID's vary by target-system endian-ness.
// Little-endian systems are far more common.  Set le==true
// when target system is little-endian (e.g., x86 machine).
//
function guid_to_base64(g,le) {
  var s = g.replace(/[^0-9a-f]/ig,'').toLowerCase();
  if (s.length != 32) return '';
  if (le) s = s.slice(6,8) + s.slice(4,6) + s.slice(2,4) + s.slice(0,2) +
        s.slice(10,12) + s.slice(8,10) +
        s.slice(14,16) + s.slice(12,14) +
        s.slice(16);
  s += '0';

  var a, p, q;
  var r = '';
  var i = 0;
  while (i < 33) {
   a =  (hexlist.indexOf(s.charAt(i++)) << 8) |
        (hexlist.indexOf(s.charAt(i++)) << 4) |
        (hexlist.indexOf(s.charAt(i++)));

   p = a >> 6;
   q = a & 63;
   r += b64list.charAt(p) + b64list.charAt(q);
  }
  r += '==';

  return r;
}; 

function base64_to_guid(base64,le) {
    var hex = "";
    for (var i = 0; i < 24; ) {
        var e1 = b64list.indexOf(base64[i++]);
        var e2 = b64list.indexOf(base64[i++]);
        var e3 = b64list.indexOf(base64[i++]);
        var e4 = b64list.indexOf(base64[i++]);
        var c1 = (e1 << 2) | (e2 >> 4);
        var c2 = ((e2 & 15) << 4) | (e3 >> 2);
        var c3 = ((e3 & 3) << 6) | e4;
        hex += hexlist[c1 >> 4];
        hex += hexlist[c1 & 15];
        if (e3 != 64) {
            hex += hexlist[c2 >> 4];
            hex += hexlist[c2 & 15];
        }
        if (e4 != 64) {
            hex += hexlist[c3 >> 4];
            hex += hexlist[c3 & 15];
        }
    }
	var a = hex.substr(6, 2) + hex.substr(4, 2) + hex.substr(2, 2) + hex.substr(0, 2);
    var b = hex.substr(10, 2) + hex.substr(8, 2);
    var c = hex.substr(14, 2) + hex.substr(12, 2);
    var d = hex.substr(16, 16);
    hex = a + b + c + d;
    var uuid = hex.substr(0, 8) + '-' + hex.substr(8, 4) + '-' + hex.substr(12, 4) + '-' + hex.substr(16, 4) + '-' + hex.substr(20, 12);
    return uuid;
};

function createShortGuid(guid) {
    var encoded = guid_to_base64(guid, true);
    encoded = encoded.replace(/\//g, '_')
                .replace(/\+/g, '-');
    return encoded.substring(0, 22);
}

function createGuid(shortGuid){
    var encoded = shortGuid.replace(/\_/g, '/')
                .replace(/\-/g, '+');
    encoded = encoded + "==";
    var decoded = base64_to_guid(encoded, true);
	console.log(decoded);
    return decoded;
};

var btnGenerateGuid;
var btnGenerateShortGuid;
var lblGeneratedValue;
var btnMapToGuid;
var btnMapToShortGuid;
var lblMappedValue;
var txtMapValue;

(function() {
	// binding controls
	btnGenerateGuid = document.getElementById('gen-guid');
	btnGenerateShortGuid = document.getElementById('gen-shortguid');
	lblGeneratedValue = document.getElementById('gen-value');
	btnMapToGuid = document.getElementById('map-guid');
	btnMapToShortGuid = document.getElementById('map-shortguid');
	lblMappedValue = document.getElementById('map-value');
	txtMapValue = document.getElementById('map-from');
	
	// binding events
	btnGenerateGuid.addEventListener("click", function(){
			lblGeneratedValue.innerHTML  = generateUUID();
		});
	
	btnGenerateShortGuid.addEventListener("click", function(){
			lblGeneratedValue.innerHTML  = createShortGuid(generateUUID());
		});
	
	btnMapToGuid.addEventListener("click", function(){
			lblMappedValue.innerHTML  = createGuid(txtMapValue.value);
		});
					
	btnMapToShortGuid.addEventListener("click", function(){
			lblMappedValue.innerHTML  = createShortGuid(txtMapValue.value);
		});
})();
