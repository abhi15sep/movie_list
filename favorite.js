(function () {
  const BASE_URL = 'https://api.themoviedb.org/3'
  const API_KEY = '0cc03cbc79a7a9a9766a411329ecb91d'
  const INDEX_URL = `${BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc`
  const POSTER_URL = `http://image.tmdb.org/t/p/w185/`
  const dataPanel = document.getElementById('data-panel')
  const data = JSON.parse(localStorage.getItem('favoriteMovies')) || []

  displayDataList(data)

  // listen to data panel
  dataPanel.addEventListener('click', (event) => {
    if (event.target.matches('.btn-show-movie')) {
      const data = event.target.dataset
      // console.log(data)
      showMovie(data.title, data.poster_path, data.release_date, data.overview)
    } else if (event.target.matches('.btn-remove-favorite')) {
      // console.log(event.target.dataset.id)
      removeFavoriteItem(event.target.dataset.id)
    }
  })

  function displayDataList(data) {
    let htmlContent = ''
    data.forEach(function (item, index) {
      htmlContent += `
        <div class="col-sm-3">
          <div class="card mb-2">
            <img class="card-img-top " src="${POSTER_URL}${item.poster_path}" alt="Card image cap">
            <div class="card-body movie-item-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer">
              <!-- "More" button -->
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-title="${item.title}" data-poster_path="${item.poster_path}", data-release_date="${item.release_date}", data-overview="${item.overview}">More</button>
              <!-- "Delete" button -->
              <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
            </div>
          </div>
        </div>
      `
    })
    dataPanel.innerHTML = htmlContent
  }

  function showMovie(title, poster_path, release_date, overview) {
    const modalTitle = document.getElementById('show-movie-title')
    const modalImg = document.getElementById('show-movie-image')
    const modalDate = document.getElementById('show-movie-date')
    const modalDescription = document.getElementById('show-movie-description')
    modalTitle.textContent = title
    modalImg.innerHTML = `
      <img src="${POSTER_URL}${poster_path}" class="img-fluid" alt="Responsive image">
    `
    modalDate.textContent = `release at: ${release_date}`
    modalDescription.textContent = `${overview}`
  }

  function removeFavoriteItem(id) {
    // find movie by id
    const index = data.findIndex(item => item.id === Number(id))
    if (index === -1) return

    data.splice(index, 1)
    localStorage.setItem('favoriteMovies', JSON.stringify(data))

    displayDataList(data)
  }
})()