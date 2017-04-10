
class FlowHelper {
    public static runParallel(farray : ((p : any, resolve : (v : any)=>void, reject : (v : any)=>void)=>void)[], p : any = null) : Promise<any> {
        if(farray.length == 0) {
            return Promise.resolve(p);
        } else {
            return Promise.all(farray.map((f)=>FlowHelper.run(f, p)));
        }
    }

    public static runSerial(farray : ((p : any, resolve : (v : any)=>void, reject : (v : any)=>void)=>void)[], p : any = null) : Promise<any> {
        let _p = Promise.resolve(p);
        farray.forEach((f)=>{
            _p = _p.then((pp)=> FlowHelper.run(f, pp));
        });
        return _p;
    }

    public static createPFunc(farray : ((p : any, resolve : (v : any)=>void, reject : (v : any)=>void)=>void)[])
        : (p : any, resolve : (v : any)=>void, reject : (v : any)=>void)=>void {
        return (_p, res, rej)=>{
            let p = FlowHelper.runParallel(farray);
            p.then(res, rej);
        }; 
    }
    
    public static createSFunc(farray : ((p : any, resolve : (v : any)=>void, reject : (v : any)=>void)=>void)[])
        : (p : any, resolve : (v : any)=>void, reject : (v : any)=>void)=>void {
        return (_p, res, rej)=>{
            let p = FlowHelper.runSerial(farray);
            p.then(res, rej);
        }; 
    }

    public static run(f : (p : any, resolve : (v : any)=>void, reject : (v : any)=>void)=>void, p : any = null) : Promise<any> {
        return new Promise((res, rej)=>{
            f(p, res, rej);
        });
    }
}

class __Functions {
    constructor(public type : number, public array : any[]) {}

    public createF() : (p : any, resolve : (v : any)=>void, reject : (v : any)=>void)=>void {
        let farray = this.array.map((x)=>{
                if(x.type == undefined) {
                    return x as (p : any, resolve : (v : any)=>void, reject : (v : any)=>void)=>void;
                } else {
                    return x.createF();
                }
            });
        if(this.type == 0) {
            return FlowHelper.createPFunc(farray);
        } else if(this.type == 1) {
            return FlowHelper.createSFunc(farray);
        } else {
            return null;
        }
    }

    public run() : Promise<any> {
        return FlowHelper.run(this.createF());
    }
}

function P(array : any[]) {
    return new __Functions(0, array);
}

function S(array : any[]) {
    return new __Functions(1, array);
}


function ff(id, v) {
    console.log("call " + id + " " + v);
}

let array = [];
for(let i = 0; i < 10; i++) {
    array.push((p, res, rej)=>{
        setTimeout(()=>{
            ff(i, p);
            res(i * 2);
        }, Math.random() * 1000 * 3);
    });
}

let f1 = FlowHelper.createPFunc(array);
FlowHelper.runSerial([f1]).then((v)=> {
    console.log("end");

    P([S(array), S(array), P(array)]).run().then((vv)=>{
        console.log("end");
    });
});



