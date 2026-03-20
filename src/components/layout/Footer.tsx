import React from 'react'
import styles from './Footer.module.css'

const footerGroups = [
  {
    title: 'Explore',
    links: ['A-Z List', 'Seasonal Charts', 'Streaming Schedule', 'Studios'],
  },
  {
    title: 'Support',
    links: ['Terms of Use', 'Privacy Policy', 'Discord Community', 'Contact Us'],
  },
]

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.brand}>
          <div className={styles.logo} aria-hidden="true">
            <span></span>
            <span></span>
          </div>
          <div>
            <strong>nofillers.moe</strong>
            <p>
              Your ultimate destination for discovering, tracking, and keeping up with the latest
              in the world of anime. Built by fans, for fans.
            </p>
          </div>
        </div>

        <div className={styles.groups}>
          {footerGroups.map((group) => (
            <div key={group.title} className={styles.group}>
              <h3>{group.title}</h3>
              {group.links.map((link) => (
                <span key={link}>{link}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.bottom}>
        <span>© 2026 nofillers.moe All rights reserved.</span>
        {/* <div className={styles.icons} aria-hidden="true">
          todo: add social media icon links
        </div> */}
      </div>
    </footer>
  )
}

export default Footer
