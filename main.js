const baseUrl = "https://tarmeezacademy.com/api/v1/"

function setupUI(){
    const token = localStorage.getItem("token");
    const loginDiv = document.getElementById("loginDiv");
    const logoutDiv = document.getElementById("logoutDiv");
    const addPostBtn = document.getElementById("add-post-btn");
    const addCommentDiv = document.getElementById("add-comment-div");

    if(token === null){

        loginDiv.classList.remove("d-none");
        logoutDiv.classList.add("d-none");

        addPostBtn != null && addPostBtn.classList.add("d-none");

        addCommentDiv != null ? addCommentDiv.classList.add("d-none") : "";

    }else{

        loginDiv.classList.add("d-none");
        logoutDiv.classList.remove("d-none");

        addPostBtn != null && addPostBtn.classList.remove("d-none");
        setNavUser();

        addCommentDiv != null ? addCommentDiv.classList.remove("d-none") : "";

    }
}

function loginBtnClicked(){
    const username = document.getElementById("username-input").value;
    const password = document.getElementById("password-input").value;
    const url = `${baseUrl}login`;
    const params = {
        "username": username,
        "password": password
    }

    axios.post(url, params)
    .then((respons) => {
        console.log(respons);
        localStorage.setItem("token", respons.data.token);
        localStorage.setItem("user", JSON.stringify(respons.data.user));

        const modalElement = document.getElementById("loginModal");
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        modalInstance.hide();
        showAlert('user logged in successfully',"success");
        setupUI();
    }).catch((error) => {
        showAlert(error.response.data.message,"danger");
    });
}



function registerBtnClicked(){
    const username = document.getElementById("register-username-input").value;
    const name = document.getElementById("register-name-input").value;
    const password = document.getElementById("register-password-input").value;
    const userImage = document.getElementById("register-image-input").files[0];

    const url = `${baseUrl}register`;

    let formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("image", userImage);
    formData.append("name", name);

    axios.post(url, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    })
    .then((respons) => {
        console.log(respons);
        localStorage.setItem("token", respons.data.token);
        localStorage.setItem("user", JSON.stringify(respons.data.user));

        const modalElement = document.getElementById("registerModal");
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        modalInstance.hide();
        showAlert('New User Registered successfully',"success");
        setupUI();
    }).catch((error) => {
        showAlert(error.response.data.message,"danger");
    });
}


function logout(){
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    showAlert('logged out successfully',"danger");
    setupUI();
}


function showAlert(messageAlert ,stateOfAlert){
    const alertPlaceholder = document.getElementById('successAlert')

    const alert = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('')

    alertPlaceholder.append(wrapper)
    }


    alert(messageAlert, stateOfAlert)
    // setTimeout(() => {
    //     const alertClose = bootstrap.Alert.getOrCreateInstance('#successAlert')
    //     alertClose.close()
    // }, 2000);
   

}

function getCurrentUser(){
    let user = null;
    const storageUser = localStorage.getItem("user") !== null && localStorage.getItem("user");
    user = JSON.parse(storageUser);
    return user;
}

function setNavUser(){
    document.getElementById("nav-user-name").innerHTML = `@${getCurrentUser().username}`;
    document.getElementById("nav-user-image").src = getCurrentUser().profile_image;

}

function postClicked(postId) {
    window.location = `postDetails.html?postId=${postId}`;
}

function userClicked(id){
    window.location = `profile.html?userId=${id}`;
    console.log(id);
}


function editPostBtnClicked(encodePost){
    let post = JSON.parse(decodeURIComponent(encodePost));

    document.getElementById("post-modal-submit-btn").innerHTML = "Update";
    document.getElementById("post-id-input").value = post.id;
    document.getElementById("postModalLabel").innerHTML = "Edit Post";
    document.getElementById("post-title-input").value = post.title;
    document.getElementById("post-body-input").value = post.body;
    document.getElementById("post-image-input").files[0] = post.image

    let postModal = new bootstrap.Modal(document.getElementById("createPostModal"), {});
    postModal.toggle();
}



function postClicked(postId) {
    window.location = `postDetails.html?postId=${postId}`;
}


function editPostBtnClicked(encodePost){
    let post = JSON.parse(decodeURIComponent(encodePost));

    document.getElementById("post-modal-submit-btn").innerHTML = "Update";
    document.getElementById("post-id-input").value = post.id;
    document.getElementById("postModalLabel").innerHTML = "Edit Post";
    document.getElementById("post-title-input").value = post.title;
    document.getElementById("post-body-input").value = post.body;
    document.getElementById("post-image-input").files[0] = post.image

    let postModal = new bootstrap.Modal(document.getElementById("createPostModal"), {});
    postModal.toggle();
}


function createPostBtnClicked(){
    let postId = document.getElementById("post-id-input").value;

    const postTitle = document.getElementById("post-title-input").value;
    const postPody = document.getElementById("post-body-input").value;
    const postImage = document.getElementById("post-image-input").files[0];

    let url = ``;
    const token = localStorage.getItem("token");

    let formData = new FormData();
    formData.append("body", postPody);
    formData.append("title", postTitle);
    formData.append("image", postImage);

    let userMessage = "Created New Post successfully";
    postId !== '' ? (url = `${baseUrl}posts/${postId}` , formData.append("_method", "put") , userMessage = " Post has been updated successfully" ): url = `${baseUrl}posts`;

    axios.post(url, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            "authorization": `Bearer ${token}`
        }
    })
    .then((respons) => {
         console.log(respons);
    
        const modalElement = document.getElementById("createPostModal");
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        modalInstance.hide();
        showAlert(userMessage,"success");
        getPosts();
    }).catch((error) => {
        showAlert(error.response.data.message,"danger");
    });

}



function deletePostBtnClicked(encodePost){
    let post = JSON.parse(decodeURIComponent(encodePost));
    document.getElementById("delete-post-id-input").value = post.id;
    document.getElementById("delete-post-title").innerHTML = post.title !== null && `<br>"${post.title}"`;


    let deletePostModal = new bootstrap.Modal(document.getElementById("deleteModal"), {});
    deletePostModal.toggle();
}

function confirmPostDelete(){
    const deletePostId = document.getElementById("delete-post-id-input").value;
    const url = `${baseUrl}posts/${deletePostId}`;
    const token = localStorage.getItem("token");

    axios.delete(url, {
        headers: {
            "authorization": `Bearer ${token}`
        }
    })
    .then((respons) => {
        console.log(respons);
      
        const modalElement = document.getElementById("deleteModal");
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        modalInstance.hide();
        showAlert('the post has been deleted successfully',"success");
        getPosts();
    }).catch((error) => {
        showAlert(error.response.data.message,"danger");
    });
}