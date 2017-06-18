/*jshint esversion: 6 */

const MAX = 10000;

/**
 * Euclidean distance
 */
function eudist(v1,v2) {
		var len = v1.length;
		var sum = 0;

		for(let i=0;i<len;i++) {
			var d = (v1[i]||0) - (v2[i]||0);
			sum += d*d;
		}
		return Math.sqrt(sum);
}

/**
 * Manhattan distance
 */
function mandist(v1,v2) {
		var len = v1.length;
		var sum = 0;

		for(let i=0;i<len;i++) {
			sum += Math.abs((v1[i]||0) - (v2[i]||0));
		}
		return sum;
}

/**
 * Inits an array with values
 */
function init(len,val) {
	var v = [];
	for(let i=0;i<len;i++) v.push(val);
	return v;
}

function skmeans(data,k,initial,maxit) {
	var ks = [], idxs = [], len = data.length;
	var conv = false, it = maxit || MAX;
	var vlen = data[0].length, multi = vlen>0;

	if(!initial) {
		for(let i=0;i<k;i++) {
			ks.push(data[Math.floor(Math.random()*len)]);
		}
	}
	else {
		ks = initial;
	}

	do {
		// For each value in data, find the nearest centroid
		for(let i=0;i<len;i++) {
			let min = Infinity, idx = 0;
			for(let j=0;j<k;j++) {
				// Multidimensional or unidimensional
				var dist = multi? eudist(data[i],ks[j]) : Math.abs(data[i]-ks[j]);
				if(dist<min) {
					min = dist;
					idx = j;
				}
			}
			idxs[i] = idx;
		}

		// Recalculate centroids
		var count = [], sum = [], old = [], dif = 0;
		for(let j=0;j<k;j++) {
			// Multidimensional or unidimensional
			count[j] = 0;
			sum[j] = multi? init(vlen,0) : 0;
			old[j] = ks[j];
		}

		// If multidimensional
		if(multi) {
			for(let j=0;j<k;j++) ks[j] = [];

			// Sum values and count for each centroid
			for(let i=0;i<len;i++) {
				let idx = idxs[i], vsum = sum[idx], vect = data[i];
				for(let h=0;h<vlen;h++) {
					vsum[h] += vect[h];
				}
				count[idx]++;
			}
			// Calculate de average for each centroid
			// and de distance between old and new centroids
			for(let j=0;j<k;j++) {
				let ksj = ks[j], sumj = sum[j],oldj = old[j], cj = count[j];
				for(let h=0;h<vlen;h++) {
					ksj[h] = sumj[h]/cj || 0;
					dif += oldj[h] - ksj[h];
				}
			}
		}
		// If unidimensional
		else {
			// Sum values and count for each centroid
			for(let i=0;i<len;i++) {
				sum[idxs[i]] += data[i];
				count[idxs[i]]++;
			}
			// Calculate de average for each centroid
			// and de distance between old and new centroids
			for(let j=0;j<k;j++) {
				ks[j] = sum[j]/count[j] || 0;
				dif += old[j] - ks[j];
			}
		}

		conv = (dif===0) || (--it<=0);
	}while(!conv);

	return {
		it : MAX-it,
		k : k,
		idxs : idxs,
		centroids : ks
	};
}

module.exports = skmeans;
