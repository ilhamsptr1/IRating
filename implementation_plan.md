# Implementation Plan: Synopsis, AI Recommendations, and Follow System

This plan outlines the steps to implement the complete synopsis on the movie detail page, Personal AI Recommendations, and a new Follow/Unfollow system for users.

## User Review Required

> [!IMPORTANT]
> This update involves significant additions to the database structure and new pages. Please review the proposed locations for the AI recommendations and the Community/Search feature to find other users.

## Open Questions

1. **AI Recommendations Placement**: The prompt mentions "tambahkan sinopsis lengkapnya pada saat buka halaman detail film, dan Rekomendasi Personal AI". Should the AI Recommendations be placed at the bottom of the **Movie Detail Page**, on the **Home Page**, or on the **Profile Page**? (I plan to add it to the Home Page and Profile Page, as it's based on general watch history, but I can add it to Movie Detail too).
2. **Finding Users**: How should users find other users to follow? Should I add a "Community" tab, or a "Search Users" feature? (I plan to add a simple "Community" section or allow searching for users).

## Proposed Changes

---

### Firebase Services

#### [MODIFY] [firebase.js](file:///e:/WEB%20RATING%20FILM/src/services/firebase.js)
- Update authentication to sync user data (displayName, photoURL, uid) to a new `users` collection upon login.
- Add new functions and hooks:
  - `useFollowSystem`: to handle follow, unfollow, check follow status, and get follower counts using a new `follows` collection.
  - `getUserStats`: to fetch another user's total ratings and watched movies.
  - `getAllUsers`: to fetch a list of users for a community page.

---

### Pages & Components

#### [MODIFY] [MovieDetail.jsx](file:///e:/WEB%20RATING%20FILM/src/pages/MovieDetail.jsx)
- Redesign the layout slightly to make the "Sinopsis Lengkap" (Overview) more prominent, potentially moving it higher up or giving it a dedicated emphasized box.

#### [NEW] [PersonalRecommendations.jsx](file:///e:/WEB%20RATING%20FILM/src/components/PersonalRecommendations.jsx)
- Create a new component that analyzes the user's `ratings` array to find their top 3 most watched genres.
- Display the text: "Karena Anda sering menonton: [Genre 1], [Genre 2], [Genre 3]".
- Fetch and display recommended movies based on these genres using TMDB API or the existing OpenAI service.
- Place this component on the Home page (and/or Profile page).

#### [NEW] [UserProfile.jsx](file:///e:/WEB%20RATING%20FILM/src/pages/UserProfile.jsx)
- Create a new page accessible via `/user/:userId`.
- Display the user's profile information: Name, total ratings (⭐), total watched movies (🎬).
- Implement the Follow/Unfollow button.
- Display a grid of the user's recent ratings/watchlist.

#### [NEW] [Community.jsx](file:///e:/WEB%20RATING%20FILM/src/pages/Community.jsx)
- Create a page to list all registered users so you can click on them and visit their profiles to follow them.

#### [MODIFY] [App.jsx](file:///e:/WEB%20RATING%20FILM/src/App.jsx)
- Add routes for `/user/:userId` and `/community`.

#### [MODIFY] [Navbar.jsx](file:///e:/WEB%20RATING%20FILM/src/components/Navbar.jsx)
- Add a link to the "Community" or "Users" page so users can find friends to follow.

## Verification Plan

### Manual Verification
1. Login with a Google account. Verify that the user profile is created in the Firestore `users` collection.
2. Rate a few movies of specific genres (e.g., Action, Sci-Fi). Verify that the Personal Recommendations component correctly identifies these genres and suggests relevant movies.
3. Login with a second account. Go to the Community page, find the first account, and click "Follow". Verify the follow count updates and the button changes to "Unfollow".
4. Check the Movie Detail page to ensure the synopsis is prominently displayed.
