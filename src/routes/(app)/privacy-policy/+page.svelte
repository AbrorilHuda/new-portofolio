<script lang="ts">
    import { JsonLd } from "svelte-meta-tags";
    import { page } from "$app/stores";
</script>

<JsonLd
    schema={{
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Kebijakan Privasi - abrorilhuda.me",
        description:
            "Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda saat mengunjungi dan menggunakan situs web ini.",
        url: `${$page.data.siteurl}/privacy-policy`,
    }}
/>

<svelte:head>
    <title>Kebijakan Privasi</title>
    <meta
        name="description"
        content="Kebijakan privasi menjelaskan bagaimana abrorilhuda.me mengumpulkan dan menggunakan informasi Anda."
    />
</svelte:head>

<div
    class="container mx-auto px-4 py-20 max-w-4xl text-gray-800 dark:text-gray-200"
>
    <div class="mb-12 border-b border-gray-200 dark:border-gray-800 pb-8">
        <h1
            class="text-4xl md:text-5xl font-bold mb-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
            Kebijakan Privasi
        </h1>
        <p class="text-gray-500 dark:text-gray-400 font-medium">
            Terakhir diperbarui: 18 Maret 2026
        </p>
    </div>

    <div class="space-y-10 leading-relaxed">
        <section>
            <p class="mb-4">
                Selamat datang di <strong class="text-gray-900 dark:text-white"
                    >abrorilhuda.me</strong
                >. Kebijakan Privasi ini menjelaskan bagaimana kami
                mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda
                saat mengunjungi dan menggunakan situs web ini.
            </p>
            <p>
                Dengan mengakses atau menggunakan situs ini, Anda menyetujui
                ketentuan yang tercantum dalam Kebijakan Privasi ini.
            </p>
        </section>

        <hr class="border-gray-200 dark:border-gray-800" />

        <section>
            <h2
                class="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white"
            >
                1. Informasi yang Kami Kumpulkan
            </h2>

            <h3
                class="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-100 mt-6"
            >
                a. Informasi yang Anda Berikan Secara Langsung
            </h3>
            <p class="mb-3">
                Kami mengumpulkan informasi yang Anda berikan secara sukarela
                melalui:
            </p>
            <ul
                class="list-disc pl-6 space-y-2 mb-8 text-gray-700 dark:text-gray-300"
            >
                <li>
                    <strong class="text-gray-900 dark:text-white"
                        >Form Kontak</strong
                    > — Nama, alamat email, dan pesan yang Anda kirimkan ketika menghubungi
                    kami.
                </li>
                <li>
                    <strong class="text-gray-900 dark:text-white"
                        >Form Feedback</strong
                    > — Pesan atau masukan singkat yang Anda kirimkan melalui widget
                    feedback di situs ini.
                </li>
            </ul>

            <h3
                class="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-100 mt-6"
            >
                b. Informasi yang Dikumpulkan Secara Otomatis
            </h3>
            <p class="mb-3">
                Saat Anda mengunjungi situs ini, beberapa informasi teknis
                mungkin dikumpulkan secara otomatis oleh server, seperti:
            </p>
            <ul
                class="list-disc pl-6 space-y-2 mb-6 text-gray-700 dark:text-gray-300"
            >
                <li>Alamat IP</li>
                <li>Jenis browser dan perangkat yang digunakan</li>
                <li>Halaman yang dikunjungi dan waktu kunjungan</li>
                <li>URL rujukan (referrer)</li>
            </ul>
            <p>
                Informasi ini dikumpulkan untuk keperluan keamanan dan
                pemeliharaan teknis situs, bukan untuk mengidentifikasi Anda
                secara pribadi.
            </p>
        </section>

        <hr class="border-gray-200 dark:border-gray-800" />

        <section>
            <h2
                class="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white"
            >
                2. Cara Kami Menggunakan Informasi Anda
            </h2>
            <p class="mb-3">
                Informasi yang Anda berikan melalui form kontak dan form
                feedback digunakan untuk:
            </p>
            <ul
                class="list-disc pl-6 space-y-2 mb-6 text-gray-700 dark:text-gray-300"
            >
                <li>
                    Merespons pertanyaan, pesan, atau masukan yang Anda kirimkan
                </li>
                <li>Meningkatkan kualitas situs dan pengalaman pengguna</li>
                <li>
                    Berkomunikasi dengan Anda terkait permintaan atau kerja sama
                </li>
            </ul>
            <p>
                Kami <strong class="text-gray-900 dark:text-white">tidak</strong
                > menjual, menyewakan, atau membagikan informasi pribadi Anda kepada
                pihak ketiga untuk tujuan pemasaran.
            </p>
        </section>

        <hr class="border-gray-200 dark:border-gray-800" />

        <section>
            <h2
                class="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white"
            >
                3. Iklan — Google AdSense
            </h2>
            <p class="mb-4">
                Situs ini menampilkan iklan yang dikelola oleh <strong
                    class="text-gray-900 dark:text-white">Google AdSense</strong
                >. Google, sebagai vendor pihak ketiga, menggunakan cookie untuk
                menayangkan iklan berdasarkan kunjungan sebelumnya pengguna ke
                situs ini atau situs lain di internet.
            </p>
            <ul
                class="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300"
            >
                <li>
                    Pengguna dapat menonaktifkan penggunaan cookie oleh Google
                    dengan mengunjungi <a
                        href="https://www.google.com/settings/ads"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors"
                        >Pengaturan Iklan Google</a
                    >.
                </li>
                <li>
                    Untuk informasi lebih lanjut tentang cara Google menggunakan
                    data, kunjungi <a
                        href="https://policies.google.com/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors"
                        >Kebijakan Privasi Google</a
                    >.
                </li>
            </ul>
        </section>

        <hr class="border-gray-200 dark:border-gray-800" />

        <section>
            <h2
                class="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white"
            >
                4. Cookie
            </h2>
            <p class="mb-4">
                Situs ini sendiri <strong class="text-gray-900 dark:text-white"
                    >tidak menggunakan cookie pelacak</strong
                > untuk tujuan analitik atau pemasaran. Namun, layanan iklan pihak
                ketiga (Google AdSense) mungkin menggunakan cookie sesuai kebijakan
                mereka sendiri.
            </p>
            <p>
                Anda dapat mengatur browser Anda untuk menolak cookie atau
                memberi peringatan saat cookie dikirimkan. Namun, beberapa
                bagian situs mungkin tidak berfungsi dengan baik jika cookie
                dinonaktifkan.
            </p>
        </section>

        <hr class="border-gray-200 dark:border-gray-800" />

        <section>
            <h2
                class="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white"
            >
                5. Keamanan Data
            </h2>
            <p>
                Kami berkomitmen untuk melindungi informasi yang Anda berikan.
                Data yang masuk melalui form kontak dan form feedback disimpan
                dan diproses dengan aman. Meskipun demikian, tidak ada metode
                transmisi data melalui internet yang 100% aman, sehingga kami
                tidak dapat menjamin keamanan mutlak.
            </p>
        </section>

        <hr class="border-gray-200 dark:border-gray-800" />

        <section>
            <h2
                class="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white"
            >
                6. Tautan ke Situs Eksternal
            </h2>
            <p>
                Situs ini mungkin memuat tautan ke situs web pihak ketiga
                (seperti GitHub, LinkedIn, atau proyek-proyek yang ditampilkan).
                Kami tidak bertanggung jawab atas praktik privasi atau konten
                dari situs eksternal tersebut. Kami menyarankan Anda untuk
                membaca kebijakan privasi masing-masing situs yang Anda
                kunjungi.
            </p>
        </section>

        <hr class="border-gray-200 dark:border-gray-800" />

        <section>
            <h2
                class="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white"
            >
                7. Privasi Anak-Anak
            </h2>
            <p>
                Situs ini tidak ditujukan untuk anak-anak di bawah usia 13
                tahun. Kami tidak secara sengaja mengumpulkan informasi pribadi
                dari anak-anak. Jika Anda adalah orang tua atau wali dan
                mengetahui bahwa anak Anda telah memberikan informasi pribadi
                kepada kami, silakan hubungi kami agar kami dapat menghapus data
                tersebut.
            </p>
        </section>

        <hr class="border-gray-200 dark:border-gray-800" />

        <section>
            <h2
                class="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white"
            >
                8. Perubahan Kebijakan Privasi
            </h2>
            <p>
                Kami dapat memperbarui Kebijakan Privasi ini sewaktu-waktu.
                Setiap perubahan akan ditampilkan di halaman ini dengan tanggal
                pembaruan terbaru di bagian atas. Kami menyarankan Anda untuk
                meninjau halaman ini secara berkala.
            </p>
        </section>

        <hr class="border-gray-200 dark:border-gray-800" />

        <section>
            <h2
                class="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white"
            >
                9. Hubungi Kami
            </h2>
            <p class="mb-4">
                Jika Anda memiliki pertanyaan atau kekhawatiran terkait
                Kebijakan Privasi ini, silakan hubungi kami melalui:
            </p>
            <ul
                class="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300"
            >
                <li>
                    <strong class="text-gray-900 dark:text-white">Email:</strong
                    >
                    <a
                        href="mailto:moh.abrorilhuda@gmail.com"
                        class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors"
                        >moh.abrorilhuda@gmail.com</a
                    >
                </li>
                <li>
                    <strong class="text-gray-900 dark:text-white"
                        >Form Kontak:</strong
                    >
                    <a
                        href="/#contact"
                        class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors"
                        >abrorilhuda.me/#contact</a
                    >
                </li>
            </ul>
        </section>

        <section
            class="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm"
        >
            <p
                class="text-gray-500 dark:text-gray-400 italic bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700/50"
            >
                Kebijakan Privasi ini berlaku untuk situs web abrorilhuda.me dan
                seluruh halaman yang terdapat di dalamnya.
            </p>
        </section>
    </div>
</div>
