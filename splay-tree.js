const canvas = document.getElementById("splayCanvas");
const ctx = canvas.getContext("2d");

// Node class for Splay Tree
class Node {
    constructor(key, x = 0, y = 0) {
        this.key = key;
        this.left = null;
        this.right = null;
        this.x = x; // X position for drawing
        this.y = y; // Y position for drawing
    }
}

// Splay Tree class
class SplayTree {
    constructor() {
        this.root = null;
    }

    // ----------- INSERT OPERATION -----------
    insert(key) {
        const newNode = new Node(key);
        this.root = this.splay(this.root, key);

        if (!this.root) {
            this.root = newNode;
            this.updateCanvas();
            return;
        }

        if (key < this.root.key) {
            newNode.right = this.root;
            newNode.left = this.root.left;
            this.root.left = null;
        } else if (key > this.root.key) {
            newNode.left = this.root;
            newNode.right = this.root.right;
            this.root.right = null;
        } else {
            return; // Duplicate keys not allowed
        }

        this.root = newNode;
        this.updateCanvas();
    }

    // ----------- DELETE OPERATION -----------
    delete(key) {
        if (!this.root) return;
        this.root = this.splay(this.root, key);

        if (this.root.key !== key) return; // Node not found

        if (!this.root.left) {
            this.root = this.root.right;
        } else {
            const temp = this.root.right;
            this.root = this.splay(this.root.left, key);
            this.root.right = temp;
        }
        this.updateCanvas();
    }

    // ----------- SEARCH OPERATION -----------
    search(key) {
        this.root = this.splay(this.root, key);
        this.updateCanvas();
        return this.root && this.root.key === key;
    }

    // ----------- SPLAY OPERATION -----------
    splay(root, key) {
        if (!root || root.key === key) return root;

        if (key < root.key) {
            if (!root.left) return root;

            if (key < root.left.key) {
                root.left.left = this.splay(root.left.left, key);
                root = this.rightRotate(root);
            } else if (key > root.left.key) {
                root.left.right = this.splay(root.left.right, key);
                if (root.left.right) root.left = this.leftRotate(root.left);
            }
            return root.left ? this.rightRotate(root) : root;
        } else {
            if (!root.right) return root;

            if (key > root.right.key) {
                root.right.right = this.splay(root.right.right, key);
                root = this.leftRotate(root);
            } else if (key < root.right.key) {
                root.right.left = this.splay(root.right.left, key);
                if (root.right.left) root.right = this.rightRotate(root.right);
            }
            return root.right ? this.leftRotate(root) : root;
        }
    }

    // ----------- ROTATION FUNCTIONS -----------
    leftRotate(x) {
        const y = x.right;
        x.right = y.left;
        y.left = x;
        return y;
    }

    rightRotate(x) {
        const y = x.left;
        x.left = y.right;
        y.right = x;
        return y;
    }

    // ----------- DRAWING TREE -----------
    updateCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.updatePositions(this.root, canvas.width / 2, 50, canvas.width / 4);
        this.drawTree(this.root);
    }

    updatePositions(node, x, y, gap) {
        if (node) {
            node.x = x;
            node.y = y;
            this.updatePositions(node.left, x - gap, y + 80, gap / 2);
            this.updatePositions(node.right, x + gap, y + 80, gap / 2);
        }
    }

    drawTree(node) {
        if (node) {
            this.drawEdge(node, node.left);
            this.drawEdge(node, node.right);
            this.drawNode(node);
            this.drawTree(node.left);
            this.drawTree(node.right);
        }
    }

    drawEdge(parent, child) {
        if (child) {
            ctx.beginPath();
            ctx.moveTo(parent.x, parent.y);
            ctx.lineTo(child.x, child.y);
            ctx.strokeStyle = "#000";
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }

    drawNode(node) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 20, 0, Math.PI * 2);
        ctx.fillStyle = "#87CEEB";
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "black";
        ctx.font = "16px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(node.key, node.x, node.y);
    }
}

// ----------- EVENT LISTENERS -----------
const tree = new SplayTree();

document.getElementById("insert-element-btn").addEventListener("click", () => {
    const value = parseInt(document.getElementById("insert-element").value);
    if (!isNaN(value)) {
        tree.insert(value);
        document.getElementById("insert-element").value = '';
    }
});

document.getElementById("search-element-btn").addEventListener("click", () => {
    const value = parseInt(document.getElementById("search-element").value);
    if (!isNaN(value)) {
        const found = tree.search(value);
        alert(found ? `${value} found!` : `${value} not found!`);
        document.getElementById("search-element").value = '';
    }
});

document.getElementById("delete-element-btn").addEventListener("click", () => {
    const value = parseInt(document.getElementById("delete-element").value);
    if (!isNaN(value)) {
        tree.delete(value);
        alert(`${value} deleted!`);
        document.getElementById("delete-element").value = '';
    }
});
