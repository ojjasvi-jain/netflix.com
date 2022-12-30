const API_KEY = "fafb627abc86c7582da1e852e5719592";
const Google_API_KEY = "AIzaSyA7Ip0q-cjrEb6bIZzi7Dkb0lir91mFYUE";
const moviedbBaseUrl = "https://api.themoviedb.org/3/";
const googleBaseUrl = "https://www.googleapis.com/youtube/v3/";
const youtubeBaseUrl = "https://www.youtube.com/watch?v=";

const apiPaths = {
  fetchAllCategories: `${moviedbBaseUrl}/genre/movie/list?api_key=${API_KEY}&language=en-US`,
  fetchEachCategoryList: (categoryId) =>
    `${moviedbBaseUrl}list/${categoryId}?api_key=${API_KEY}&language=en-US`,
  fetchImageEachCategory: (imageId) =>
    `https://image.tmdb.org/t/p/original${imageId}`,
  fetchTrendingCategory: `${moviedbBaseUrl}trending/movie/day?api_key=${API_KEY}`,
  fetchYouTubeUrl: (movieName) =>
    `${googleBaseUrl}search?part=snippet&q=${movieName}&key=${Google_API_KEY}`,
};

const categoryContainerRef = document.getElementById("category__container");
const trendingBanner = document.querySelector("#banner");
const navigationHeader = document.querySelector("#header");
console.log(navigationHeader);
const init = () => {
  getTendingBanner();
  fetchAndBuildCategories();
};

//Fetching all categories
const fetchAndBuildCategories = () => {
  fetch(apiPaths.fetchAllCategories)
    .then((res) => res.json())
    .then(({ genres }) => {
      if (Array.isArray(genres) && genres.length > 0) {
        genres.forEach((category) => {
          fetchandBuildCategory(
            apiPaths.fetchEachCategoryList(category.id),
            category.name,
            false
          );
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

//fetching movies of single category
const fetchandBuildCategory = (movieUrl, categoryName, IsTrendingMovie) => {
  return fetch(movieUrl)
    .then((res) => {
      if (res.status === 200) return res.json();
    })
    .then((resData) => {
      let moviesContainer = IsTrendingMovie ? resData.results : resData.items;
      let movieHtmlTemplate = moviesContainer
        .map((item) => {
          if (item.poster_path !== null)
            return `<img
            class = "movie__img"   
              onClick="getMovieTrailer('${item.title}')"
              src=${apiPaths.fetchImageEachCategory(item.poster_path)}
              alt=${item.title}
             />`;
          else {
            return `<img
            class = "movie__img" 
              src="https://www.whats-on-netflix.com/wp-content/uploads/2022/12/whats-coming-to-netflix-in-january-2023-1.png"
              alt=${item.title}
              onClick='getMovieTrailer( (${item.title}) )'
        />`;
          }
        })
        .join("");
      let movieListLeng = IsTrendingMovie
        ? resData.results.length
        : resData.items.length;
      if (movieListLeng)
        categoryContainerRef.innerHTML += `
          <div class="movie__Container">
          <h2 class="movie_header">
            ${categoryName}
            <span> Explore all </span>
          </h2>
          <div class="movie_items" id="movie_items">
             ${movieHtmlTemplate}
          </div>
        </div>
          `;
      return moviesContainer;
    })
    .catch((err) => {
      console.log(err);
    });
};

// Function to get the trending movie banner details
const getTendingBanner = () => {
  let moviesSet = fetchandBuildCategory(
    apiPaths.fetchTrendingCategory,
    "Trending Now",
    true
  );

  moviesSet.then((data) => {
    let index = parseInt(Math.random() * data.length);
    trendingBanner.style.backgroundImage = `url(${apiPaths.fetchImageEachCategory(
      data[index].poster_path
    )})`;
    console.log(
      `${apiPaths.fetchImageEachCategory()}${data[index].poster_path}`
    );

    trendingBanner.innerHTML += `    <div class="banner--section container">
     <h2 class="banner__header">${data[index].title}</h2>
     <p class="banner__text">Trending in movies | released - ${data[index].release_date}</p>
     <p class="banner__description">
${data[index].overview}
     </p>
     <div class="banner__buttonWrapper">
       <div> 
       <button class="banner__button">
       <div> Play</div>
        <svg
           width="24"
           height="24"
           viewBox="0 0 24 24"
           fill="none"
           xmlns="http://www.w3.org/2000/svg"
           class="Hawkins-Icon Hawkins-Icon-Standard"
         >
           <path
             d="M4 2.69127C4 1.93067 4.81547 1.44851 5.48192 1.81506L22.4069 11.1238C23.0977 11.5037 23.0977 12.4963 22.4069 12.8762L5.48192 22.1849C4.81546 22.5515 4 22.0693 4 21.3087V2.69127Z"
             fill="currentColor"
           ></path>
         </svg>
       </button>
      </div> 
      
      <div>
       <button class="banner__button">
       <span> More info</span>
         
         <svg
           width="24"
           height="24"
           viewBox="0 0 24 24"
           fill="none"
           xmlns="http://www.w3.org/2000/svg"
           class="Hawkins-Icon Hawkins-Icon-Standard"
         >
           <path
             fill-rule="evenodd"
             clip-rule="evenodd"
             d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3ZM1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM13 10V18H11V10H13ZM12 8.5C12.8284 8.5 13.5 7.82843 13.5 7C13.5 6.17157 12.8284 5.5 12 5.5C11.1716 5.5 10.5 6.17157 10.5 7C10.5 7.82843 11.1716 8.5 12 8.5Z"
             fill="currentColor"
           ></path>
         </svg>
       </button>
      <div> 
     </div>
   </div>

   `;
  });
};

function getMovieTrailer(movieTitle) {
  fetch(apiPaths.fetchYouTubeUrl(movieTitle))
    .then((data) => data.json())
    .then((movieTrailorData) => {
      console.log(movieTrailorData.items[0].id.videoId);
      window.open(
        `${youtubeBaseUrl}${movieTrailorData.items[0].id.videoId}`,
        "_blank"
      );
      console.log(`${youtubeBaseUrl}${movieTrailorData.items[0].id.videoId}`);
    });
}

window.addEventListener("load", () => {
  init();
  window.addEventListener("scroll", () => {
    if (window.scrollY > 6) {
      navigationHeader.classList.add("bg_color");
    } else navigationHeader.classList.remove("bg_color");
  });
});
