
const { ccclass, property } = cc._decorator;

@ccclass("PoolManager")
export class PoolManager {
    public static handle = new Map<string, cc.Node[]>();
    private static a:number = 0;

    public static getNode(prefab: cc.Prefab, parent: cc.Node) {
        const name = prefab.data.name;
        let node: cc.Node = null;
        const pool = this.handle.get(name);
        if (this.handle.has(name) && pool.length > 0) {
            node = this.handle.get(name).pop();
        } else {
            node = cc.instantiate(prefab) as cc.Node;
            node.setParent(parent);
        }
        
        return node;
    }

    public static setNode(target: cc.Node) {
        const name = target.name;
        if (this.handle.has(name)) {
            this.handle.get(name).push(target);
        } else {
            if (name.length > 0) {
                this.handle.set(name, [target]);
            } else {
                target.destroy();
            }
        }
    }
}
