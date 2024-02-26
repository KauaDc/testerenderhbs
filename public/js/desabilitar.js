document.getElementById("xixi").onclick = function() {
    if (this.checked) {
        document.getElementById("quantxixi").disabled = false;
    } else {
        document.getElementById("quantxixi").disabled = true;
    }
}
document.getElementById("coco").onclick = function() {
    if (this.checked) {
        document.getElementById("quantcoco").disabled = false;
    } else {
        document.getElementById("quantcoco").disabled = true;
    }
}
document.getElementById("cafesn").onclick = function() {
    if (this.checked) {
        document.getElementById("cafe").disabled = false;
    } else {
        document.getElementById("cafe").disabled = true;
    }
}
document.getElementById("almocosn").onclick = function() {
    if (this.checked) {
        document.getElementById("almoco").disabled = false;
    } else {
        document.getElementById("almoco").disabled = true;
    }
}
document.getElementById("frutasn").onclick = function() {
    if (this.checked) {
        document.getElementById("fruta").disabled = false;
    } else {
        document.getElementById("fruta").disabled = true;
    }
}
document.getElementById("lanchesn").onclick = function() {
    if (this.checked) {
        document.getElementById("lanche").disabled = false;
    } else {
        document.getElementById("lanche").disabled = true;
    }
}