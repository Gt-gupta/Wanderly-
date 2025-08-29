import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import "../App.css";
import axios from "axios";
import PostTemplate from "./PostTemplate";
import PollTemplate from "./PollTemplate";

function Center() {
    const [feeds, setFeeds] = useState([]); // Unified feed array with randomized posts and polls
    const [page, setPage] = useState(1); // Current page
    const [hasMore, setHasMore] = useState(true); // Flag to check if more data is available
    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState(null); // Error state

    // Fetch posts and polls when the page changes
    useEffect(() => {
        const fetchFeeds = async () => {
            if (loading) return; // Prevent multiple fetches at the same time

            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("User is not authenticated");
                }

                // Fetch posts and polls for the current page
                const [postsResponse, pollsResponse] = await Promise.all([
                    axios.get("http://localhost:5000/get/getPosts", {
                        headers: { Authorization: `Bearer ${token}` },
                        params: { page },
                    }),
                    axios.get("http://localhost:5000/get/getPolls", {
                        headers: { Authorization: `Bearer ${token}` },
                        params: { page },
                    }),
                ]);

                const newPosts = postsResponse.data.data || [];
                const newPolls = pollsResponse.data.data || [];

                // Stop fetching if no new data
                if (newPosts.length === 0 && newPolls.length === 0) {
                    setHasMore(false);
                } else {
                    // Combine and randomize posts and polls, avoiding duplicates
                    const combinedFeeds = shuffleArray([...newPosts, ...newPolls]);
                    setFeeds((prevFeeds) => [
                        ...prevFeeds,
                        ...combinedFeeds.filter(
                            (newFeed) => !prevFeeds.some((feed) => feed.id === newFeed.id)
                        ),
                    ]);
                }
            } catch (err) {
                console.error("Error fetching feeds:", err);
                setError(err.message);
            }
            setLoading(false);
        };

        fetchFeeds();
    }, [page]);

    const incrementPage = () => {
        setPage((prevPage) => prevPage + 1);
    };

    const shuffleArray = (array) => {
        return array.sort(() => Math.random() - 0.5);
    };

    if (loading && feeds.length === 0)
        return <p style={{ textAlign: "center" }}>Loading...</p>;
    if (error)
        return <p style={{ textAlign: "center", color: "red" }}>Error: {error}</p>;

    return (
        <div id="scrollableCentre" className="Center">
            <h2 style={{ textAlign: "left" }}>Feeds</h2>
            <InfiniteScroll
                dataLength={feeds.length}
                next={incrementPage}
                hasMore={hasMore}
                height={"90vh"}
                loader={<p style={{ textAlign: "center" }}>Loading more...</p>}
                endMessage={<p>No more feeds</p>}
                scrollableTarget="scrollableCenter"
            >
                <div>
                    {feeds.length > 0 ? (
                        feeds.map((feed) => {
                            if (feed.description && feed.image_path !== undefined) {
                                return (
                                    <PostTemplate
                                        key={feed.id}
                                        id={feed.id}
                                        name={`User ${feed.userId}`}
                                        text={feed.description}
                                        imagePath={feed.image_path}
                                        likes={feed.likes}
                                        likedByYou={feed.likedByYou}
                                    />
                                );
                            } else if (feed.description && feed.opt1 !== undefined) {
                                return (
                                    <PollTemplate
                                        key={feed.id}
                                        id={feed.id}
                                        text={feed.description}
                                        name={`User ${feed.userId}`}
                                        no={feed.no}
                                        opt1={feed.opt1}
                                        opt2={feed.opt2}
                                        opt3={feed.opt3}
                                        opt4={feed.opt4}
                                        c1={feed.c1}
                                        c2={feed.c2}
                                        c3={feed.c3}
                                        c4={feed.c4}
                                    />
                                );
                            }
                            return null;
                        })
                    ) : (
                        <p style={{ textAlign: "center" }}>No feeds available.</p>
                    )}
                </div>
            </InfiniteScroll>
        </div>
    );
}

export default Center;
