// LIKE BUTTON
function toggleLike(button){
    // ADD OR REMOVE THE LIKED CLASS 
    button.classList.toggle("liked");
}

function viewStory(story){
    // ADD THE VIEWED CLASS TO THE CLinICKED STORY
    story.classList.add("viewed");
}












/* =========================================
   INSTAGRAM CLONE - JAVASCRIPT
   ========================================= */


/* =========================================
   1. LIKE AND UNLIKE POSTS
   ========================================= */

function toggleLike(button) {
    const post = button.closest(".post");

    if (!post) {
        console.error("Could not find the post container.");
        return;
    }

    const countElement = post.querySelector(".like-count");

    if (!countElement) {
        console.error("Could not find the like count.");
        return;
    }

    // Give each post a unique ID if it doesn't have one.
    if (!post.dataset.postId) {
        post.dataset.postId =
            "post-" + Array.from(
                document.querySelectorAll(".post")
            ).indexOf(post);
    }

    const postId = post.dataset.postId;
    const likesKey = "instagramLikes";
    const countsKey = "instagramOriginalCounts";

    // Read saved information safely.
    function readStorage(key) {
        try {
            return JSON.parse(localStorage.getItem(key) || "{}");
        } catch (error) {
            return {};
        }
    }

    const savedLikes = readStorage(likesKey);
    const originalCounts = readStorage(countsKey);

    // Read the original count only once.
    if (
        !Object.prototype.hasOwnProperty.call(
            originalCounts,
            postId
        )
    ) {
        const initialText = countElement.textContent
            .replace(/,/g, "")
            .trim();

        const initialCount = Number(initialText);

        if (!Number.isFinite(initialCount) || initialText === "") {
            console.error(
                "Invalid starting like count:",
                countElement.textContent
            );
            return;
        }

        originalCounts[postId] = initialCount;
        localStorage.setItem(
            countsKey,
            JSON.stringify(originalCounts)
        );
    }

    const originalCount = Number(originalCounts[postId]);

    if (!Number.isFinite(originalCount)) {
        console.error("The saved original count is invalid.");
        return;
    }

    // Toggle the like state.
    const isLiked = savedLikes[postId] !== true;
    savedLikes[postId] = isLiked;

    localStorage.setItem(
        likesKey,
        JSON.stringify(savedLikes)
    );

    // Update the heart appearance.
    button.classList.toggle("liked", isLiked);

    // Display the correct count.
    const newCount = originalCount + (isLiked ? 1 : 0);

    countElement.textContent = newCount.toLocaleString();
}


/* =========================================
   2. VIEW STORIES
   ========================================= */

function viewStory(story) {
    if (!story) return;

    // Give each story a unique ID if necessary.
    if (!story.dataset.storyId) {
        story.dataset.storyId =
            "story-" + Array.from(
                document.querySelectorAll(".story")
            ).indexOf(story);
    }

    const storyId = story.dataset.storyId;

    let viewedStories = [];

    try {
        viewedStories = JSON.parse(
            localStorage.getItem("instagramViewedStories") || "[]"
        );

        if (!Array.isArray(viewedStories)) {
            viewedStories = [];
        }
    } catch (error) {
        viewedStories = [];
    }

    if (!viewedStories.includes(storyId)) {
        viewedStories.push(storyId);
    }

    localStorage.setItem(
        "instagramViewedStories",
        JSON.stringify(viewedStories)
    );

    story.classList.add("viewed");
}


/* =========================================
   3. RESTORE SAVED STATES ON PAGE LOAD
   ========================================= */

function restoreInstagramState() {
    // Restore likes and counts.
    let savedLikes = {};
    let originalCounts = {};

    try {
        savedLikes = JSON.parse(
            localStorage.getItem("instagramLikes") || "{}"
        );

        originalCounts = JSON.parse(
            localStorage.getItem("instagramOriginalCounts") || "{}"
        );
    } catch (error) {
        console.error("Could not read saved like information.");
    }

    document.querySelectorAll(".post").forEach((post, index) => {
        // Use the same ID generation rule as toggleLike().
        if (!post.dataset.postId) {
            post.dataset.postId = "post-" + index;
        }

        const postId = post.dataset.postId;
        const button = post.querySelector(".like-button");
        const countElement = post.querySelector(".like-count");

        if (button) {
            button.classList.toggle(
                "liked",
                savedLikes[postId] === true
            );
        }

        if (!countElement) return;

        // If an invalid old count was saved, use the HTML count.
        if (
            !Object.prototype.hasOwnProperty.call(
                originalCounts,
                postId
            ) ||
            !Number.isFinite(Number(originalCounts[postId]))
        ) {
            const htmlCount = Number(
                countElement.textContent.replace(/,/g, "").trim()
            );

            if (!Number.isFinite(htmlCount)) {
                console.error(
                    "Check the HTML like count for post:",
                    postId
                );
                return;
            }

            originalCounts[postId] = htmlCount;
        }

        const originalCount = Number(originalCounts[postId]);
        const displayedCount =
            originalCount + (savedLikes[postId] === true ? 1 : 0);

        countElement.textContent =
            displayedCount.toLocaleString();
    });

    localStorage.setItem(
        "instagramOriginalCounts",
        JSON.stringify(originalCounts)
    );

    // Restore viewed stories.
    let viewedStories = [];

    try {
        viewedStories = JSON.parse(
            localStorage.getItem("instagramViewedStories") || "[]"
        );

        if (!Array.isArray(viewedStories)) {
            viewedStories = [];
        }
    } catch (error) {
        viewedStories = [];
    }

    document.querySelectorAll(".story").forEach((story, index) => {
        if (!story.dataset.storyId) {
            story.dataset.storyId = "story-" + index;
        }

        story.classList.toggle(
            "viewed",
            viewedStories.includes(story.dataset.storyId)
        );
    });
}


/* =========================================
   4. RUN WHEN THE PAGE LOADS
   ========================================= */

if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        restoreInstagramState
    );
} else {
    restoreInstagramState();
}

    //   SAVE BUTTON 
function toggleSave(button) {
    const post = button.closest(".post");
    const postId = post.dataset.postId;

    if (!postId) {
        alert("This post needs a unique ID.");
        return;
    }

    let savedPosts = JSON.parse(
        localStorage.getItem("savedPosts") || "[]"
    );

    if (savedPosts.includes(postId)) {
        // Remove from saved posts
        savedPosts = savedPosts.filter(id => id !== postId);

        button.classList.remove("fa-solid");
        button.classList.add("fa-regular");
        button.title = "Save post";
    } else {
        // Save the post
        savedPosts.push(postId);

        button.classList.remove("fa-regular");
        button.classList.add("fa-solid");
        button.title = "Remove saved post";
    }

    localStorage.setItem("savedPosts", JSON.stringify(savedPosts));
}
document.addEventListener("DOMContentLoaded", function () {
    const savedPosts = JSON.parse(
        localStorage.getItem("savedPosts") || "[]"
    );

    document.querySelectorAll(".post").forEach(post => {
        const postId = post.dataset.postId;
        const saveButton = post.querySelector(".save-button");

        if (saveButton && savedPosts.includes(postId)) {
            saveButton.classList.remove("fa-regular");
            saveButton.classList.add("fa-solid");
            saveButton.title = "Remove saved post";
        }
    });
});