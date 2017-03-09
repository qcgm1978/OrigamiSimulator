/**
 * Created by amandaghassaei on 2/25/17.
 */

function Crease(edge, face1Index, face2Index, targetTheta, type, node1, node2, index){
    //type = 0 panel, 1 crease

    //face1 corresponds to node1, face2 to node2
    this.edge = edge;
    for (var i=0;i<edge.nodes.length;i++){
        edge.nodes[i].addInvCrease(this);
    }
    this.face1Index = face1Index;
    this.face2Index = face2Index;
    this.targetTheta = targetTheta;
    this.type = type;
    this.node1 = node1;
    this.node2 = node2;
    this.index = index;
    node1.addCrease(this);
    node2.addCrease(this);
}

Crease.prototype.getLength = function(){
    return this.edge.getLength();
};

Crease.prototype.getVector = function(){
    return this.edge.getVector();
};

Crease.prototype.getNormal1Index = function(){
    return this.face1Index;
};

Crease.prototype.getNormal2Index = function(){
    return this.face2Index;
};

Crease.prototype.getTargetTheta = function(){
    return this.targetTheta;
};

Crease.prototype.getK = function(){
    var length = this.getLength();
    if (this.type == 0) return globals.panelStiffness*length;
    return globals.creaseStiffness*length;
};

Crease.prototype.getD = function(){
    return globals.percentDamping*2*Math.sqrt(this.getK());
};

Crease.prototype.getIndex = function(){
    return this.index;
};

Crease.prototype.getLengthToNode1 = function(){
    return this.getLengthTo(this.node1);
};

Crease.prototype.getLengthToNode2 = function(){
    return this.getLengthTo(this.node2);
};

Crease.prototype.getLengthTo = function(node){
    var vector1 = this.getVector().normalize();
    var nodePosition = node.getOriginalPosition();
    var vector2 = nodePosition.sub(this.edge.nodes[1].getOriginalPosition());
    var projLength = vector1.dot(vector2);
    var length = Math.sqrt(vector2.lengthSq()-projLength*projLength);
    if (length <= 0.0) {
        console.warn("bad moment arm");
        length = 0.001;
    }
    return length;
};

Crease.prototype.getNodeIndex = function(node){
    if (node == this.node1) return 1;
    else if (node == this.node2) return 2;
    console.warn("no node found");
    return 0;
};

Crease.prototype.destroy = function(){
    this.node1.removeCrease(this);
    this.node2.removeCrease(this);
    if (this.edge && this.edge.nodes){
        for (var i=0;i<this.edge.nodes.length;i++){
            this.edge.nodes[i].removeInvCrease(this);
        }
    }
    this.edge = null;
    this.face1Index = null;
    this.face2Index = null;
    this.targetTheta = null;
    this.type = null;
    this.node1 = null;
    this.node2 = null;
    this.index = null;
};