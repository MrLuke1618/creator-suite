import React, { useState, useEffect } from 'react';
import { useLocalization } from '../contexts/LocalizationContext';

const Footer: React.FC = () => {
    const { t } = useLocalization();
    const quotes: string[] = t('footer.quotes'); 
    
    // Initialize with a random index to avoid starting with the same quote every time
    const [currentQuoteIndex, setCurrentQuoteIndex] = useState(() => Math.floor(Math.random() * quotes.length));

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentQuoteIndex(prevIndex => {
                let newIndex;
                // Ensure the new quote is different from the current one
                do {
                    newIndex = Math.floor(Math.random() * quotes.length);
                } while (newIndex === prevIndex && quotes.length > 1);
                return newIndex;
            });
        }, 5000); // Change quote every 5 seconds

        return () => clearInterval(interval); // Cleanup on component unmount
    }, [quotes.length]);

    const startYear = 2025;
    const currentYear = new Date().getFullYear();
    const yearString = currentYear > startYear ? `${startYear}-${currentYear}` : startYear;

    return (
        <footer className="footer-bg">
            <div className="footer-content">
                <div className="social-icons footer-item-social">
                    <a href="https://www.youtube.com/@luke1618gamer" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                        <i className="fab fa-youtube"></i>
                    </a>
                    <a href="https://www.tiktok.com/@hoangcao2704" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                        <i className="fab fa-tiktok"></i>
                    </a>
                    <a href="https://www.linkedin.com/in/hoangminhcao" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                        <i className="fab fa-linkedin"></i>
                    </a>
                </div>
                <div id="quote-container" className="quote-container footer-item-quote">
                    {quotes.length > 0 && (
                         <p id="quote-text" key={currentQuoteIndex}>
                            "{quotes[currentQuoteIndex]}"
                        </p>
                    )}
                </div>
                <p className="copyright-text footer-item-copy">&copy; {yearString} MrLuke1618. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;