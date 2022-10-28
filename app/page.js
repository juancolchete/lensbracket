'use client'

import { useState, useEffect } from 'react'
import {
  client, exploreProfiles, getPublications
} from '../api'
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  const [profiles, setProfiles] = useState([])
  useEffect(() => {
    fetchProfiles()
  }, [])
  async function fetchProfiles() {
    try {
      const response = await client.query(exploreProfiles).toPromise()
      const profileData = await Promise.all(response.data.exploreProfiles.items.map(async profile => {
        const pub = await client.query(getPublications, { id: profile.id, limit: 1 }).toPromise()
        profile.publication = pub.data.publications.items[0]
        let picture = profile.picture
        if (picture && picture.original && picture.original.url) {
          if (picture.original.url.startsWith('ipfs://')) {
            let result = picture.original.url.substring(7, picture.original.url.length)
            profile.picture.original.url = `http://lens.infura-ipfs.io/ipfs/${result}`
          }
        }
        console.log('profile.picture: ', profile.picture)
        return profile
      }))
      setProfiles(profileData)
    } catch (err) {
      console.log({ err })
    }
  }
  console.log({ profiles })
  return (
    <div style={styles.container}>
      <h1>My Lens App</h1>
      {
        profiles.map((profile, index) => (
          <Link href={`/profile/${profile.id}`} key={index}>
            <div style={styles.profile}>
              {
                profile.picture ? (
                  <Image
                    src={profile.picture.original?.url || "https://source.unsplash.com/random/200x200?sig=1"}
                    width="52"
                    height="52"
                    alt={profile.handle}
                  />
                ) : <div style={blankPhotoStyle} />
              }
              <h3>{profile.handle}</h3>
              <p >{profile.publication?.metadata.content}</p>
            </div>
          </Link>
        ))
      }
    </div>
  )
}

const styles = {
  container: {
    padding: '40px 80px'
  },
  profile: {
    margin: '30px 0px'
  }
}