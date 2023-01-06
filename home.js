let currentPage = 1;
let lastPage = 1;
const loadingPosts = document.querySelector(".loading");

// window.addEventListener("scroll", () => {
//     const endOfPage = window.innerHeight + window.pageYOffset >= document.body.offsetHeight;
//     if(endOfPage && currentPage < lastPage){
//         currentPage += currentPage;
//         getPosts(currentPage, false);
//         console.log(currentPage);
//     } 

// });


window.addEventListener("scroll", () => {
    const {scrollTop, scrollHeight, clientHeight} = document.documentElement;
    const theBottom = scrollTop + clientHeight;

    if( theBottom >= scrollHeight && currentPage < lastPage){
        console.log({lastPage, currentPage});
        currentPage = currentPage + 1;
        showLoadingPosts();
    }

});

setupUI();

getPosts();


function getPosts(page = 1, reload=true) {
    const url = `${baseUrl}posts?limit=4&page=${page}`

    axios.get(url)
    .then((respons) => {
        const posts = respons.data.data;
        
        lastPage = respons.data.meta.last_page;
        if(reload) document.getElementById("posts").innerHTML = "";
        for(post of posts){
        
            const author = post.author;
            const currentUser = getCurrentUser();
            const notfound = "./imgs/placeholders/404-error-not-found-page-lost-1024x788-1.png"
            let posTitle = "";
            post.title === null ? posTitle : posTitle = post.title;
            let content = `
              <div class="card new-shadow">
                    <div class="card-header">
                    <span class="pointer" onclick="userClicked(${author.id})">
                        <img src="${author.profile_image}" alt="user1" class="img-to-thumbnail mb-1">
                        <b>@${author.username}</b>
                    </span>
                    ${currentUser.id === author.id 
                        ? (`
                            <button class="btn btn-outline-danger float-end" onclick="deletePostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')">Delete</button>
                            <button class="btn btn-outline-warning float-end me-1 " onclick="editPostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')">Edit</button>
                            `
                          )
                           
                        : ''
                    }
                    </div>
                    <div class="card-body pointer" onclick="postClicked(${post.id})">
                    <img src="${typeof post.image !== "object" ? post.image : notfound}" alt="post-img" class="w-100">
                    <h6 class="mt-1">${post.created_at}</h6>
                    <h5>${posTitle}</h5>
                    <p>${post.body}</p>
                    <hr>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
                        </svg>
                        <span>(${post.comments_count}) Comments</span>
                        <span id="post-tags-${post.id}">
                        </span>
                    </div>
                    </div>
                </div>
            `
            document.getElementById("posts").innerHTML += content;
            document.getElementById(`post-tags-${post.id}`).innerHTML = "";
            for(tag of post.tags){
                let tagsContent = `
                    <button class="btn btn-sm rounded-5 bg-dark text-white">${tag.name}</button>
                `
                document.getElementById(`post-tags-${post.id}`).innerHTML += tagsContent;
            }

        }
    })

    loadingPosts.classList.remove("show");
}


function showLoadingPosts() {
    loadingPosts.classList.add("show");
    setTimeout(() => {
        getPosts(currentPage, false);
    }, 700);
}


function addPostBtnClicked(){
    document.getElementById("post-modal-submit-btn").innerHTML = "Create";
    document.getElementById("post-id-input").value = "";
    document.getElementById("postModalLabel").innerHTML = "Create A New Post";
    document.getElementById("post-title-input").value = "";
    document.getElementById("post-body-input").value = "";
    document.getElementById("post-image-input").files[0] = ""

    let postModal = new bootstrap.Modal(document.getElementById("createPostModal"), {});
    postModal.toggle();
}

