/**
 * yyyy-MM-dd
 * @param date 
 */
function toDateString1(date : Date) {
    return date.getFullYear() + "-" + 
        ("0" + (date.getMonth() + 1)).slice(-2) + "-" +
        ("0" + date.getDate()).slice(-2);
}

/**
 * yyyy/MM/dd   
 * @param date 
 */
function toDateString2(date : Date) {
    return date.getFullYear() + "/" + 
        ("0" + (date.getMonth() + 1)).slice(-2) + "/" +
        ("0" + date.getDate()).slice(-2);
}

/**
 * HH:mm:ss
 * @param date 
 */
function toTimeString1(date : Date) {
    return date.getHours() + ":" + 
        ("0" + date.getMinutes()).slice(-2) + ":" +
        ("0" + date.getSeconds()).slice(-2);
}

/**
 * HH:mm:ss.fff
 * @param date 
 */
function toTimeString2(date : Date) {
    return toTimeString1(date) + "." +
        ("00" + date.getMilliseconds()).slice(-3);
}

/**
 * yyyy-MM-dd HH:mm:ss
 * @param date 
 */
function toDateTimeString1(date : Date) {
    return toDateString1(date) + " " + 
        toTimeString1(date);
}

/**
 * yyyy-MM-ddTHH:mm:ss
 * @param date 
 */
function toDateTimeString2(date : Date) {
    return toDateString1(date) + "T" + 
        toTimeString1(date);
}

/**
 * yyyy-MM-dd HH:mm:ss.fff
 * @param date 
 */
function toDateTimeString3(date : Date) {
    return toDateString1(date) + " " + 
        toTimeString2(date);
}

/**
 * yyyy-MM-ddTHH:mm:ss.fff
 * @param date 
 */
function toDateTimeString4(date : Date) {
    return toDateString1(date) + "T" + 
        toTimeString2(date);
}

/**
 * yyyy/MM/dd HH:mm:ss
 * @param date 
 */
function toDateTimeString5(date : Date) {
    return toDateString2(date) + " " + 
        toTimeString1(date);
}

/**
 * yyyy/MM/dd HH:mm:ss.fff
 * @param date 
 */
function toDateTimeString6(date : Date) {
    return toDateString2(date) + " " + 
        toTimeString2(date);
}

function parseDate(s : string) : Date;
function parseDate(s : string, d : Date) : Date;
function parseDate(s : string, f : ()=>Date) : Date;
function parseDate(s : string, x? : any) {
    let d = parseDateTime(s, x);
    if(!d) {
        d.setHours(0, 0, 0, 0);
    }
    return d;
}

function parseDateTime(s : string) : Date;
function parseDateTime(s : string, d : Date) : Date;
function parseDateTime(s : string, f : ()=>Date) : Date;
function parseDateTime(s : string, x? : any)  : Date {
    let r = /^ *([1-9][0-9]*)[\-\/]([01][0-9])[\-\/]([0-3][0-9])([ T]([0-2][0-9])\:([0-5][0-9])\:([0-5][0-9])(\.([0-9]{3}))?)? *$/;
    let m = r.exec(s);
    if(m) {
        if(!m[4]) {
            return new Date(+m[1], +m[2] - 1, +m[3]);
        } else if(!m[8]) {
            return new Date(+m[1], +m[2] - 1, +m[3], +m[5], +m[6], +m[7]);
        } else {
            return new Date(+m[1], +m[2] - 1, +m[3], +m[5], +m[6], +m[7], +m[9]);
        }
    } else {
        if(!x) {
            return null;
        } else if(typeof(x) == "function") {
            return x();
        } else {
            return x as Date;
        }
    }
}

function parseNumber(s : string) : number;
function parseNumber(s : string, n : number) : number;
function parseNumber(s : string, f : ()=>number) : number;
function parseNumber(s : string, x? :any) : number {
    let n = +s;
    if(n) {
        return n;
    } else {
        if(!x) {
            return null;
        } else if(typeof(x) == "function") {
            return x();
        } else {
            return x as number;
        }
    }
}

console.log(parseNumber("120.56"));
console.log(parseNumber("xxx"));
console.log(parseNumber("10e10", 100));
console.log(parseNumber("     150     ", ()=>199));

let d = new Date();

let s1 = toDateString1(d);
let s2 = toDateString2(d);
let s3 = toDateTimeString1(d);
let s4 = toDateTimeString2(d);
let s5 = toDateTimeString3(d);
let s6 = toDateTimeString4(d);
let s7 = toDateTimeString5(d);
let s8 = toDateTimeString6(d);

console.log("1:" + parseDateTime("", ()=>new Date()));
console.log("2:" + parseDateTime(s1));
console.log("3:" + parseDateTime(s2));
console.log("4:" + parseDateTime(s3));
console.log("5:" + parseDateTime(s4));
console.log("6:" + parseDateTime(s5));
console.log("7:" + parseDateTime(s6));
console.log("8:" + parseDateTime(s7));
console.log("9:" + parseDateTime(s8));

console.log();

parseDate(s1);
parseDate(s2);
parseDate(s3);
parseDate(s4);
parseDate(s5);
parseDate(s6);
parseDate(s7);
parseDate(s8);

let L = 1;

{
    let t1 = new Date();

    for(var i = L; i > 0; i--) {
        parseDateTime(s8);
    }
    
    let t2 = new Date();

    console.log(L / ((t2.getTime() - t1.getTime())/1000) );
}


function run(f, ...args){
    f(args);
}

run((a1, a2)=>{
    console.log(a1);
    console.log(a2);
}, 10, "33", "ww", "55");