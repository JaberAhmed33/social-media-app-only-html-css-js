const currentUser = getCurrentUser();

setupUI();
getUser();
getPosts();

function userIdClicked(){
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("userId") == null ? currentUser.id : urlParams.get("userId");
    return userId;
}

function getUser() {
    const url = `${baseUrl}users/${userIdClicked()}`

    axios.get(url)
    .then((respons) => {
        const user = respons.data.data

        document.getElementById("main-info-email").innerHTML = ! user.email ? `${user.username}@example.com`: user.email;
        document.getElementById("main-info-name").innerHTML = user.name;
        document.getElementById("main-info-username").innerHTML = user.username;
        document.getElementById("profile-img").src = user.profile_image;
        document.getElementById("profile-header").innerHTML = user.username;


        document.getElementById("posts-count").innerHTML = `<h1>${user.posts_count} <span class="h6 text-black-50">Posts</span></h1>`;
        document.getElementById("comments-count").innerHTML = `<h1>${user.comments_count} <span class="h6 text-black-50">Comments</span></h1>`;

        console.log(user);
    })
    .catch((error) => {
        showAlert(error.response.data.message,"danger");
    });

}


function getPosts() {
    const url = `${baseUrl}users/${userIdClicked()}/posts`

    axios.get(url)
    .then((respons) => {
        const posts = respons.data.data;
        console.log(posts);

        document.getElementById("posts").innerHTML = "";

        for(post of posts){
        
            const author = post.author;
            const notfound = "./imgs/placeholders/404-error-not-found-page-lost-1024x788-1.png"
            let posTitle = "";
            post.title === null ? posTitle : posTitle = post.title;
            let content = `
              <div class="card new-shadow">
                    <div class="card-header">
                        <img src="${author.profile_image}" alt="user1" class="img-to-thumbnail mb-1">
                        <b>@${author.username}</b>
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
    .catch((error) => {
        showAlert(error.response.data.message,"danger");
    });

    // loadingPosts.classList.remove("show");
}
