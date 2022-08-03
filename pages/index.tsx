import type { NextPage } from "next";
import { KeyboardEvent, RefObject, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type shortened = [{ link?: string; short?: string }?];

const Shortener = (props: any) => {
    const [URL, setURL] = useState("");
    const inputField = useRef<HTMLInputElement>(null);
    const addLinkAlert = useRef<HTMLInputElement>(null);

    async function handleClick() {
        if (URL === "") {
            inputField.current?.classList.toggle("noURL");
            addLinkAlert.current?.classList.toggle("display-none");
            setTimeout(() => {
                inputField.current?.classList.toggle("noURL");
                addLinkAlert.current?.classList.toggle("display-none");
            }, 2000);
        } else {
            fetch(`https://api.shrtco.de/v2/shorten?url=${URL}`)
                .then(response => response.json())
                .then(data => {
                    props.setShortened([...props.shortened, { link: data.result.original_link, short: data.result.short_link }]);
                    localStorage.setItem(
                        "shortened",
                        JSON.stringify([...props.shortened, { link: data.result.original_link, short: data.result.short_link }])
                    );
                })
                .catch(error => alert("URL is not valid"));
        }
    }

    const keyHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.code === "Enter") {
            handleClick();
        }
    };

    return (
        <>
            <motion.div className="shortener-wrapper" initial={{ y: 500 }} animate={{ y: "-50%" }}>
                <input
                    type="text"
                    value={URL}
                    ref={inputField}
                    className="url-input"
                    placeholder="Shorten a link here..."
                    onChange={e => setURL(e.target.value)}
                    onKeyDown={e => keyHandler(e)}
                />
                <button onClick={() => handleClick()}>Shorten it!</button>
                <div className="no-url-message display-none" ref={addLinkAlert}>
                    Please add a link
                </div>
            </motion.div>
        </>
    );
};

const Home: NextPage = () => {
    const hamMenu = useRef<HTMLDivElement>(null);
    const [shortened, setShortened] = useState<shortened>([]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const items = JSON.parse(localStorage.getItem("shortened") as string);
            if (items) {
                setShortened(items);
            }
        }
    }, []);

    const copyHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const target = e.target as HTMLInputElement;
        navigator.clipboard.writeText(shortened[target.value].short);
        target.classList.add("copied");
        target.innerHTML = "Copied!";
        setTimeout(() => {
            target.classList.remove("copied");
            target.innerHTML = "Copy";
        }, 1500);
    };

    const hamToggler = (menu: RefObject<HTMLDivElement>) => {
        menu.current !== null && menu.current.classList.toggle("opacity-zero");
    };

    const ShortenedList = () => {
        return (
            <>
                {shortened.map((element: any, i) => {
                    return (
                        <motion.div key={i} className="shortened-line" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <span className="long">{element.link}</span>
                            <span className="short">{element.short}</span>
                            <button value={i} className="copy" onClick={e => copyHandler(e)}>
                                Copy
                            </button>
                        </motion.div>
                    );
                })}
            </>
        );
    };

    return (
        <>
            <nav>
                <div className="nav-left">
                    <img src="\images\logo.svg" alt="" />
                    <a href="#">Features</a>
                    <a href="#">Pricing</a>
                    <a href="#">Resources</a>
                </div>
                <div className="nav-right">
                    <a href="#">Login</a>
                    <button>Sign Up</button>
                </div>
                <div className="hamburger-btn" onClick={() => hamToggler(hamMenu)}>
                    <span className="line line1"></span>
                    <span className="line line2"></span>
                    <span className="line line3"></span>
                </div>
                <div className="hamburger-menu opacity-zero" ref={hamMenu}>
                    <div className="links">
                        <a href="#">Features</a>
                        <a href="#">Pricing</a>
                        <a href="#">Resources</a>
                    </div>
                    <div className="login">
                        <a href="#">Login</a>
                        <button>Sign Up</button>
                    </div>
                </div>
            </nav>
            <main>
                <div className="hero">
                    <div className="text-container">
                        <h1>More than just shorter links</h1>
                        <p> Build your brand’s recognition and get detailed insights on how your links are performing.</p>
                        <button>Get Started</button>
                    </div>
                    <div className="hero-image"></div>
                </div>
                <div className="statistics">
                    <Shortener setShortened={setShortened} shortened={shortened} />
                    <ShortenedList />
                    <h2>Advanced Statistics</h2>
                    <p>Track how your links are performing across the web with our advanced statistics dashboard.</p>
                    <div className="stats-cards-wrapper">
                        <motion.div
                            className="stats-card card1"
                            initial={{ opacity: 0, x: "-500" }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ type: "Tween", duration: 1, delay: 1 }}
                            viewport={{ once: true }}>
                            <div className="card-icon"></div>
                            <h3>Brand Recognition</h3>
                            <p>
                                Boost your brand recognition with each click. Generic links don’t mean a thing. Branded links help instil confidence
                                in your content.
                            </p>
                        </motion.div>
                        <motion.div
                            className="stats-card card2"
                            initial={{ opacity: 0, x: "-800" }}
                            whileInView={{ opacity: 1, x: 0, y: 45 }}
                            transition={{ type: "Tween", duration: 1, delay: 0.5 }}
                            viewport={{ once: true }}>
                            <div className="card-icon"></div>
                            <h3>Detailed Records</h3>
                            <p>
                                Gain insights into who is clicking your links. Knowing when and where people engage with your content helps inform
                                better decisions.
                            </p>
                        </motion.div>
                        <motion.div
                            className="stats-card card3"
                            initial={{ opacity: 0, x: "-1100" }}
                            whileInView={{ opacity: 1, x: 0, y: 90 }}
                            transition={{ type: "Tween", duration: 1 }}
                            viewport={{ once: true }}>
                            <div className="card-icon"></div>
                            <h3>Fully Customizable</h3>
                            <p>Improve brand awareness and content discoverability through customizable links, supercharging audience engagement.</p>
                        </motion.div>
                        <motion.div
                            className="cyan-line"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ type: "Tween", duration: 1, delay: 2 }}
                            viewport={{ once: true, margin: "-100px" }}></motion.div>
                    </div>
                </div>
                <div className="get-started">
                    <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
                        Boost your links today
                    </motion.h2>
                    <motion.button initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
                        Get Started
                    </motion.button>
                </div>
            </main>
            <footer>
                <img src="\images\logo.svg" alt="" />
                <ul>
                    <li>Features</li>
                    <li>Link Shortening</li>
                    <li>Branded Links</li>
                    <li>Analytics</li>
                </ul>
                <ul>
                    <li>Resources</li>
                    <li>Blog</li>
                    <li>Developers</li>
                    <li>Support</li>
                </ul>
                <ul>
                    <li>Company</li>
                    <li>About</li>
                    <li>Our Team</li>
                    <li>Careers</li>
                    <li>Contact</li>
                </ul>
                <div className="social">
                    <img src="\images\icon-facebook.svg" alt="" />
                    <img src="\images\icon-twitter.svg" alt="" />
                    <img src="\images\icon-pinterest.svg" alt="" />
                    <img src="\images\icon-instagram.svg" alt="" />
                </div>
            </footer>
        </>
    );
};

export default Home;
