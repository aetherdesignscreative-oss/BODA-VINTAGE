
/* REPRODUCTOR MUSICAL */
window.WeddingMusic = {
    audio: new Audio(),
    selectedIndex: -1,
    playing: false,

    init() {
        this.audio.loop = true;
        this.audio.preload = "none";

        this.renderSongs();
        this.updateControls();

        this.audio.addEventListener("play", () => {
            this.playing = true;
            this.updateControls();
        });

        this.audio.addEventListener("pause", () => {
            this.playing = false;
            this.updateControls();
        });

        this.audio.addEventListener("error", () => {
            this.playing = false;
            this.updateControls();

            if (typeof App !== "undefined" && App.toast) {
                App.toast(
                    "No se pudo reproducir el archivo. Comprueba que el MP3 exista en assets/music y que su nombre sea correcto."
                );
            }
        });

        const toggleButton = document.getElementById("music-toggle");

        if (toggleButton) {
            toggleButton.addEventListener("click", () => {
                this.toggle();
            });
        }
    },

    renderSongs() {
        const list = document.getElementById("song-list");

        if (!list || !window.WEDDING || !Array.isArray(WEDDING.songs)) {
            return;
        }

        list.replaceChildren();

        WEDDING.songs.forEach((song, index) => {
            const button = document.createElement("button");

            button.type = "button";
            button.className = "song-option";

            const number = document.createElement("span");
            number.className = "song-number";
            number.textContent = String(index + 1).padStart(2, "0");

            const info = document.createElement("span");
            info.className = "song-info";

            const title = document.createElement("strong");
            title.textContent = song.title;

            const artist = document.createElement("small");
            artist.textContent = song.artist;

            info.append(title, artist);

            const playIcon = document.createElement("span");
            playIcon.className = "song-play";
            playIcon.setAttribute("aria-hidden", "true");
            playIcon.textContent = "＋";

            button.append(number, info, playIcon);

            button.addEventListener("click", () => {
                this.select(index);
            });

            list.appendChild(button);
        });
    },

    async select(index) {
        const song = WEDDING.songs[index];

        if (!song || !song.file) {
            return;
        }

        this.selectedIndex = index;

        /* Cargar el MP3 desde assets/music/ */
        this.audio.pause();
        this.audio.src = `assets/music/${encodeURIComponent(song.file)
            .replace(/%2F/gi, "/")}`;
        this.audio.load();

        document.querySelectorAll(".song-option").forEach((button, i) => {
            const selected = i === index;

            button.classList.toggle("selected", selected);

            const icon = button.querySelector(".song-play");

            if (icon) {
                icon.textContent = selected ? "♫" : "＋";
            }

            button.setAttribute("aria-pressed", String(selected));
        });

        try {
            await this.audio.play();
        } catch (error) {
            this.playing = false;
            this.updateControls();

            if (typeof App !== "undefined" && App.toast) {
                App.toast(
                    "No se pudo iniciar la canción. Verifica el nombre del archivo y la carpeta assets/music."
                );
            }
        }

        this.updateControls();
    },

    async toggle() {
        if (this.playing) {
            this.audio.pause();
            return;
        }

        if (this.selectedIndex >= 0) {
            try {
                await this.audio.play();
            } catch (error) {
                if (typeof App !== "undefined" && App.toast) {
                    App.toast(
                        "No se pudo reproducir la canción seleccionada."
                    );
                }
            }

            this.updateControls();
            return;
        }

        if (typeof App !== "undefined" && App.toast) {
            App.toast("Elige primero una canción en el menú musical.");
        }

        if (typeof App !== "undefined" && App.navigate) {
            App.navigate("music");
        }
    },

    updateControls() {
        const button = document.getElementById("music-toggle");

        if (!button) {
            return;
        }

        button.classList.toggle("is-playing", this.playing);

        button.textContent = this.playing ? "Ⅱ" : "♫";

        button.setAttribute(
            "aria-label",
            this.playing ? "Pausar música" : "Reproducir música"
        );

        button.title = this.playing
            ? "Pausar música"
            : "Reproducir música";
    }
};
