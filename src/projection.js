const a=6377276.345, inv_f=300.8017, f=1/inv_f, e2=2*f-f*f, e=Math.sqrt(e2);
const deg=Math.PI/180, phi0=26*deg, lam0=90*deg, k0=0.99878641, FE=2743195.59223332, FN=914398.530744441;
function m(phi){return Math.cos(phi)/Math.sqrt(1-e2*Math.sin(phi)*Math.sin(phi));}
function t(phi){const s=Math.sin(phi);return Math.tan(Math.PI/4-phi/2)/Math.pow((1-e*s)/(1+e*s),e/2);}
const n=Math.sin(phi0), F=m(phi0)/(n*k0*Math.pow(t(phi0),n)), rho0=a*F*Math.pow(t(phi0),n);
export function llToIIB(lonDeg,latDeg){const lam=lonDeg*deg,phi=latDeg*deg;const rho=a*F*Math.pow(t(phi),n);const th=n*(lam-lam0);
const E=FE+rho*Math.sin(th); const N=FN+rho0-rho*Math.cos(th); return {E:Math.round(E),N:Math.round(N)};}
