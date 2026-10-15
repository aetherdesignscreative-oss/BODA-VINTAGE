/* ANIMACIONES Y PANTALLA DE CARGA */
window.WeddingAnimations = {
    loader: document.getElementById("loader"),

    showLoader() {
        this.loader?.classList.remove("hidden");
    },

    hideLoader() {
        this.loader?.classList.add("hidden");
    },

    async transition(callback) {
        this.showLoader();
        await new Promise(resolve => setTimeout(resolve, 650));

        try {
            callback();
        } finally {
            await new Promise(resolve => setTimeout(resolve, 250));
            this.hideLoader();
        }
    },

    init() {
        const initials = document.querySelectorAll(
            ".monogram, .music-monogram, .closing-monogram"
        );

        initials.forEach(element => {
            element.innerHTML = `${WEDDING.initials[0]} <i>&</i> ${WEDDING.initials[1]}`;
        });
    }
};
