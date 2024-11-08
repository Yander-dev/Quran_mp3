const apiUrl = "https://mp3quran.net/api/v3/reciters"
const lang = "ar"


// fetch data => reciters
async function getReciters() {
    const chooseReciter = document.getElementById("chooseReciter")

    const res = await fetch(`${apiUrl}?language=${lang}`);
    const data = await res.json();

    chooseReciter.innerHTML = `<option value="">اختر قارئ</option> `
    data.reciters.forEach(reciter => chooseReciter.innerHTML += ` <option value="${reciter.id}">${reciter.name}</option> `)

    chooseReciter.addEventListener("change", (e) => getMoshaf(e.target.value))

}
getReciters()


// fetch data => moshaf
async function getMoshaf(reciter) {
    const chooseMoshaf = document.getElementById("chooseMoshaf")

    const res = await fetch(`${apiUrl}?language=${lang}&reciter=${reciter}`);
    const data = await res.json();
    const moshafs = data.reciters[0].moshaf

    chooseMoshaf.innerHTML = `<option value="" data-server="" data-surahList="">اختر مصحف</option>`
    moshafs.forEach(moshaf => {
        chooseMoshaf.innerHTML += `<option value="${moshaf.id}" data-server="${moshaf.server}" data-surahList="${moshaf.surah_list}">${moshaf.name}</option>`
    })


    chooseMoshaf.addEventListener("change", (e) => {
        const selectedMoshaf = chooseMoshaf.options[chooseMoshaf.selectedIndex]
        const surahServer = selectedMoshaf.dataset.server
        const surahList = selectedMoshaf.dataset.surahlist

        getSurah(surahServer,surahList)

    })

}



// fetch data => surah
async function getSurah(surahServer,surahList) {
    const chooseSurah = document.getElementById("chooseSurah")

    console.log(surahServer)
    const res = await fetch(`https://mp3quran.net/api/v3/suwar`);
    const data = await res.json();
    const surahName = data.suwar

    surahList = surahList.split(",")

    chooseSurah.innerHTML = `<option value=".mp3">اختر سورة</option>`
    surahList.forEach(surah => {
        const padStart = surah.padStart(3, "0")
        surahName.forEach(surahName => {
            if(surahName.id == surah) {
                chooseSurah.innerHTML += `<option value="${surahServer}${padStart}.mp3">${surahName.name}</option>`
            }
        })
    })
    
    // play surah function
    chooseSurah.addEventListener("change", (e) => {
        const selectedSurah = chooseSurah.options[chooseSurah.selectedIndex]
        playSurah(selectedSurah.value) // mp3 function
    })
}


// play surah 
function playSurah(surahmp3) {
    const audioPlayer = document.getElementById("audioPlayer")
    audioPlayer.src = surahmp3
    audioPlayer.play()
}


// quran live
function playLive(channel) {
    if(Hls.isSupported()) {
        var video = document.getElementById('liveVideo');
        var hls = new Hls();
        hls.loadSource(`${channel}`);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED,function() {
          video.play();
      });
    }
}


