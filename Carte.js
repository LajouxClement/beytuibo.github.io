export class Carte {

    /**
     * 
     * @param {string} name 
     * @param {int} identifier 
     * @param {array} urls 
     * @param {boolean} isGolden 
     * @param {int} quantity 
     * @param {int} quantityNeeded
     */
    constructor(name, identifier, urls, isGolden, quantity, quantityNeeded) {
        this.name = name;
        this.identifier = identifier;
        this.urls = urls;
        this.isGolden = isGolden;
        this.quantity = quantity;
        this.quantityNeeded = quantityNeeded;
    }

    returnIsGolden() {
        return this.isGolden;
    }
    appendTo(element, first = false) {
        /**
         * div qui prend tout
         */
        let overlayElement = document.createElement("div");
        if (this.quantity >= this.quantityNeeded) {
            overlayElement.className = "overlay-image"
        } else {
            overlayElement.className = "overlay-image-gray"
        }

        /**
         * l'image
         */
        let imageElement = document.createElement("img");
        imageElement.className = "fit-picture image"
        imageElement.identifier = this.identifier;
        if (this.isGolden) {
            imageElement.src = this.urls[1];
        } else {
            imageElement.src = this.urls[0];
        }
        imageElement.alt = this.name;
        overlayElement.appendChild(imageElement);

        /**
         * text de quantité
         */
        if (!first) {
            let quantiteElement = document.createElement('div');
            quantiteElement.className = "text";
            quantiteElement.innerHTML = this.quantity + "/" + this.quantityNeeded;
            overlayElement.appendChild(quantiteElement);
        }
        /**
         * on ajoute tout a l'element
         */
        element.appendChild(overlayElement);
    }

    /**
     * 
     * @param {HTMLElement} element 
     * @param {int} i 
     */

    compterElement(listFusion, current) {
        let cnt = 0;
        for (var i = 0; i < listFusion.length; i++) {
            if (listFusion[i].identifier == current) {
                //current = listFusion[i].identifier;
                cnt++;
            }
        }
        return cnt;
    }
}