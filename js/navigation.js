/* NAVEGACIÓN ENTRE PANTALLAS SIN DESPLAZAMIENTO */
window.WeddingNavigation = {
    current: "music",

    screens: {
        music: "music-screen",
        cover: "cover-screen",
        story: "story-screen",
        details: "details-screen",
        schedule: "schedule-screen",
        rsvp: "rsvp-screen",
        closing: "closing-screen"
    },

    init() {
        document.querySelectorAll("[data-go]").forEach(button => {
            button.addEventListener("click", () => {
                App.navigate(button.dataset.go);
            });
        });

        document.getElementById("enter-invitation").addEventListener("click", () => {
            App.navigate("cover");
        });

        document.getElementById("open-menu").addEventListener("click", () => {
            this.openMenu();
        });

        document.getElementById("close-menu").addEventListener("click", () => {
            this.closeMenu();
        });

        document.getElementById("menu-overlay").addEventListener("click", event => {
            if (event.target.id === "menu-overlay") this.closeMenu();
        });

        document.getElementById("restart-button").addEventListener("click", () => {
            App.navigate("music");
        });

        document.addEventListener("keydown", event => {
            if (event.key === "Escape") this.closeMenu();
        });
    },

    navigate(name) {
        const screenId = this.screens[name];
        if (!screenId) return;

        this.closeMenu();
        const change = () => {
            document.querySelectorAll(".screen").forEach(screen => {
                screen.classList.remove("active");
                screen.setAttribute("aria-hidden", "true");
            });

            const next = document.getElementById(screenId);
            next.classList.add("active");
            next.setAttribute("aria-hidden", "false");
            this.current = name;

            document.getElementById("music-toggle").classList.toggle(
                "visible", name !== "music"
            );

            document.title = "INVITACION DE BODA";
        };

        WeddingAnimations.transition(change);
    },

    openMenu() {
        document.getElementById("menu-overlay").classList.add("open");
        document.getElementById("menu-overlay").setAttribute("aria-hidden", "false");
        document.getElementById("close-menu").focus();
    },

    closeMenu() {
        document.getElementById("menu-overlay").classList.remove("open");
        document.getElementById("menu-overlay").setAttribute("aria-hidden", "true");
    }
};
