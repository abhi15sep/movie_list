/* Use IIFE (Immediately Invoked Function Expression), 
a JavaScript function that runs as soon as it is defined, 
to avoid name conflict with other libraries. */

(function () {
  const BASE_URL = 'https://api.themoviedb.org/3'
  const API_KEY = '0cc03cbc79a7a9a9766a411329ecb91d'
  const INDEX_URL = `${BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc`
  const POSTER_URL = `http://image.tmdb.org/t/p/w185/`
  const data = []
  const dataPanel = document.querySelector('#data-panel')
  const searchForm = document.getElementById('search')
  const searchInput = document.getElementById('search-input')
  const pagination = document.getElementById('pagination')
  const modeIcon = document.getElementById('mode-icon')
  const ITEM_PER_PAGE = 12
  let paginationData = []
  let viewMode = 0    // 0 denote 'gridMode(cards)', 1 denote 'listMode'.
  let currPage = 1

  // get movie data by a third-party API
  for (let i = 1; i < 6; i++) {
    axios
      .get(`${INDEX_URL}&page=${i}`)
      .then((response) => {
        // use spread operator
        data.push(...response.data.results)
        /* or use for-of loop/ forEach method
        for (let item of response.data.results) {
          data.push(item)
        }
        */
        console.log(`data.length: ${data.length}`)
        // displayDataList(data)
        getTotalPages(data)
        getPageData(1, data)
      }).catch((err) => { console.log(err) })
  }

  // listen to data panel click event
  dataPanel.addEventListener('click', (event) => {
    if (event.target.matches('.btn-show-movie')) {
      const data = event.target.dataset
      // console.log(data)
      showMovie(data.title, data.poster_path, data.release_date, data.overview)
    } else if (event.target.matches('.btn-add-favorite')) {
      // console.log(event.target.dataset.id)
      addFavoriteItem(event.target.dataset.id)
    }
  })

  // listen to search form submit event
  /*把 <form> 和 <button> 放在一起時，
  <button> 的預設行為是「將表單內容透過 HTTP request 提交給遠端伺服器」，
  除非使用 Ajax 技術發送非同步請求，否則一般的 HTTP request 都會刷新瀏覽器畫面。
  遇到這種有預設行為的元件，需要使用 event.preventDefault() 來終止它們的預設行為。*/
  searchForm.addEventListener('submit', event => {
    event.preventDefault()
    let results = []
    const regex = new RegExp(searchInput.value, 'i')
    results = data.filter(movie => movie.title.match(regex))
    console.log(`results.length: ${results.length}`)
    // displayDataList(results)
    getTotalPages(results)
    getPageData(1, results)
  })

  // listen to pagination click event
  pagination.addEventListener('click', event => {
    console.log(event.target.dataset.page)
    if (event.target.tagName === 'A') {
      getPageData(event.target.dataset.page)
    }
  })

  // listen to modeIcon click event
  modeIcon.addEventListener('click', event => {
    if (event.target.matches('#listMode')) {
      viewMode = 1
    } else if (event.target.matches('#gridMode')) {
      viewMode = 0
    }
    getPageData(currPage)
  })

  function displayDataList(data) {
    let htmlContent = ''
    if (viewMode === 0) {
      data.forEach(function (item, index) {
        htmlContent += `
        <div class="col-sm-3">
          <div class="card mb-2">
            <img class="card-img-top" src="${POSTER_URL}${item.poster_path}" alt="Card image cap">
            <div class="card-body movie-item-body">
              <h6>${item.title}</h6>
            </div>
            <div class="card-footer">
              <!-- "More" button -->
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-title="${item.title}" data-poster_path="${item.poster_path}", data-release_date="${item.release_date}", data-overview="${item.overview}">More</button>
              <!-- "Favorite" button -->
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>            
            </div>
          </div>
        </div>
      `
      })
    } else {
      htmlContent += `
        <table class="table table-hover">
          <thead class="thead-light">
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Title</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
      `
      data.forEach(function (item, index) {
        htmlContent += `
            <tr>
              <th class="align-middle" scope="row">${item.id}</th>
              <td class="align-middle">${item.title}</td>
              <td class="align-middle">            
                <!-- "More" button -->
                <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-title="${item.title}" data-poster_path="${item.poster_path}", data-release_date="${item.release_date}", data-overview="${item.overview}">More</button>
                <!-- "Favorite" button -->
                <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>            
              </td>
            </tr>
      `
      })
      htmlContent += `</tbody></table>`
    }
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

  function addFavoriteItem(id) {
    const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
    const movie = data.find(item => item.id === Number(id))
    if (list.some(item => item.id === Number(id))) {
      alert(`${movie.title} is already in your favorite list.`)
    } else {
      list.push(movie)
      alert(`Added ${movie.title} to your favorite list!`)
    }
    localStorage.setItem('favoriteMovies', JSON.stringify(list))
  }

  function getTotalPages(data) {
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
    let pageItemContent = ''
    for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
        <li class="page-item">
          <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
        </li>
      `
    }
    pagination.innerHTML = pageItemContent
  }

  function getPageData(pageNum, data) {
    currPage = pageNum
    paginationData = data || paginationData
    let offset = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
    displayDataList(pageData)
  }
})()