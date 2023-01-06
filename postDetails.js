const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("postId");
setupUI();


getPosts();
function getPosts() {
  const url = `${baseUrl}posts/${postId}`;

  axios.get(url).then((respons) => {
    const post = respons.data.data;
    const comments = post.comments;
    const author = post.author;

    const notfound = "./imgs/placeholders/404-error-not-found-page-lost-1024x788-1.png"
    let posTitle = "";
    post.title === null ? posTitle : posTitle = post.title;
    let content = `
            <div class="row d-flex justify-content-center mt-5">
            <div class="col-9">
                <h1>
                    <span>${author.username}'s</span>
                    Post
                </h1>
            </div>
        </div>

        <div class="row d-flex justify-content-center">
            <div class="col-9">
                <div class="card new-shadow">
                    <div class="card-header">
                        <img src="${author.profile_image}" alt="user1" class="img-to-thumbnail mb-1">
                        <b>@${author.username}</b>
                    </div>
                    <div class="card-body">
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

                    <div id="comments">
                   
                    </div>

                    
                    <div class="input-group p-3" id="add-comment-div">
                      <input type="text" id="comment-input" placeholder="add your comment here.." class="form-control ">
                      <button class="btn btn-outline-info" type="button" onclick="createCommentClicked()">Send</button>
                    </div>

                </div>
            </div>
        </div>

                `;
    document.getElementById("postDetailsContainer").innerHTML = content;
    for(tag of post.tags){
        let tagsContent = `
            <button class="btn btn-sm rounded-5 bg-dark text-white">${tag.name}</button>
        `
        document.getElementById(`post-tags-${post.id}`).innerHTML += tagsContent;
    }

    let commentContent= '';
    for(comment of comments){

        commentContent += `
            <div class="p-3 bg-second border-comment">
                <div class="mb-3">
                    <span class="pointer" onclick="userClicked(${comment.author.id})">
                        <img src="${comment.author.profile_image}" alt="user1" class="img-to-thumbnail mb-1">
                        <b>@${comment.author.username}</b>
                    </span>
                </div>

                <div class="bg-text p-1 ">
                    <p>${comment.body}</p>
                </div>
            </div>
        `
        document.getElementById("comments").innerHTML = commentContent;
    }
  });
}

function createCommentClicked() {
    let commentBody = document.getElementById("comment-input").value;
    const url = `${baseUrl}posts/${postId}/comments`;
    let params = {
        "body": commentBody,
    }
    let token = localStorage.getItem("token");

    axios.post(url, params, {
        headers: {
            "authorization": `Bearer ${token}`
        }
    }).then((respons) => {
        showAlert("Your just added a comment!","success");
        getPosts();
    }).catch((error) => {
        showAlert(error.response.data.message,"danger");
    });
}
