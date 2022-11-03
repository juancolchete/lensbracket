// app/profile/[id]/page.js
'use client'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { ethers } from 'ethers'
import Image from 'next/image'
import { client, getPublications, getProfile,getProfileByHandle } from '../../../api'
import ABI from '../../../abi.json'

const CONTRACT_ADDRESS = '0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d'

export default function Profile() {
  const [profile, setProfile] = useState()
  const [connected, setConnected] = useState()
  const [publications, setPublications] = useState([])
  const [account, setAccount] = useState('')

  const pathName = usePathname()
  const id = pathName?.split('/')[2]

  useEffect(() => {
    if (id) {
      fetchProfile()
    }
    checkConnection()
  }, [id])

  async function checkConnection() {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const addresses = await provider.listAccounts();
    if (addresses.length) {
      setConnected(true)
    } else {
      setConnected(false)
    }
  }

  async function fetchProfile() {
    let returnedProfile
    try {
      if(id.indexOf("0x0") > -1){
        returnedProfile = await client.query(getProfile, { id }).toPromise();
      }else{
        returnedProfile = await client.query(getProfileByHandle, { handle:id }).toPromise();
      }

      const profileData = returnedProfile.data.profile
      const picture = profileData.picture
      if (picture && picture.original && picture.original.url) {
        if (picture.original.url.startsWith('ipfs://')) {
          let result = picture.original.url.substring(7, picture.original.url.length)
          profileData.picture.original.url = `http://lens.infura-ipfs.io/ipfs/${result}`
        }
      }
      setProfile(profileData)
      const pubs = await client.query(getPublications, { id:returnedProfile.data.profile.id, limit: 50 }).toPromise()
      setPublications(pubs.data.publications.items)
    } catch (err) {
      console.log('error fetching profile...', err)
    }
  }

  async function connectWallet() {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts"
    })
    console.log('accounts: ', accounts)
    accounts[0]
    setAccount(account)
    setConnected(true)
  }

  function getSigner() {
    const provider = new ethers.BrowserProvider(window.ethereum)
    return provider.getSigner();
  }

  async function followUser() {
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      ABI,
      getSigner()
    )

    try {
      const tx = await contract.follow([id], [0x0])
      await tx.wait()
      console.log(`successfully followed ... ${profile.handle}`)
    } catch (err) {
      console.log('error: ', err)
    }
  }

  if (!profile) return null
  
  return (
    <div>
      <div style={profileContainerStyle}>
        {
          !connected && (
            <button style={buttonStyle} onClick={connectWallet}>Connect Wallet</button>
            )
          }
        <Image
          width="200"
          height="200"
          alt={profile.handle}
          src={profile.picture?.original?.url}
          style={profileImg}
          />
        <h1>{profile.handle}</h1>
          </div>
        {
            publications.map((pub, index) => (
              <div key={index} style={publicationContainerStyle}>
                <p>{pub.metadata.content}</p>
              </div>
            ))
        }
        {
          connected && (
            <button
              style={buttonStyle}
              onClick={followUser}
            >Follow {profile.handle}</button>
          )
        }
    </div>
  )
}

const buttonStyle = {
  padding: '10px 30px',
  backgroundColor: 'white',
  color: 'rgba(0, 0, 0, .6)',
  cursor: 'pointer',
  borderRadius: '40px',
  fontWeight: 'bold'
}

const publicationContainerStyle = {
  padding: '20px 0px',
}

const profileContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px  60px'
}
const profileImg = {
  borderRadius: '50%',
}