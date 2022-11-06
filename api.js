import { createClient } from 'urql'

const APIURL = "https://api.lens.dev"

export const client = new createClient({
  url: APIURL
})

export const exploreProfiles = `
  query ExploreProfiles {
    exploreProfiles(request: { sortCriteria: MOST_FOLLOWERS }) {
      items {
        id
        name
        bio
        handle
        picture {
          ... on MediaSet {
            original {
              url
            }
          }
        }
        stats {
          totalFollowers
        }
      }
    }
  }
`

export const getPublications = `query ProfileFeed($request: PublicationsQueryRequest!, $reactionRequest: ReactionFieldResolverRequest, $profileId: ProfileId) {
  publications(request: $request) {
    items {
      ... on Post {
        ...PostFields
        __typename
      }
      ... on Comment {
        ...CommentFields
        __typename
      }
      ... on Mirror {
        ...MirrorFields
        __typename
      }
      __typename
    }
    pageInfo {
      next
      __typename
    }
    __typename
  }
}

fragment PostFields on Post {
  id
  profile {
    ...ProfileFields
    __typename
  }
  reaction(request: $reactionRequest)
  mirrors(by: $profileId)
  hasCollectedByMe
  onChainContentURI
  isGated
  canComment(profileId: $profileId) {
    result
    __typename
  }
  canMirror(profileId: $profileId) {
    result
    __typename
  }
  canDecrypt(profileId: $profileId) {
    result
    reasons
    __typename
  }
  collectModule {
    ...CollectModuleFields
    __typename
  }
  stats {
    ...StatsFields
    __typename
  }
  metadata {
    ...MetadataFields
    __typename
  }
  hidden
  createdAt
  appId
  __typename
}

fragment ProfileFields on Profile {
  id
  name
  handle
  bio
  ownedBy
  isFollowedByMe
  stats {
    totalFollowers
    totalFollowing
    __typename
  }
  attributes {
    key
    value
    __typename
  }
  picture {
    ... on MediaSet {
      original {
        url
        __typename
      }
      __typename
    }
    ... on NftImage {
      uri
      __typename
    }
    __typename
  }
  followModule {
    __typename
  }
  __typename
}

fragment CollectModuleFields on CollectModule {
  ... on FreeCollectModuleSettings {
    type
    contractAddress
    followerOnly
    __typename
  }
  ... on FeeCollectModuleSettings {
    type
    referralFee
    contractAddress
    followerOnly
    amount {
      ...ModuleFeeAmountFields
      __typename
    }
    __typename
  }
  ... on LimitedFeeCollectModuleSettings {
    type
    collectLimit
    referralFee
    contractAddress
    followerOnly
    amount {
      ...ModuleFeeAmountFields
      __typename
    }
    __typename
  }
  ... on LimitedTimedFeeCollectModuleSettings {
    type
    collectLimit
    endTimestamp
    referralFee
    contractAddress
    followerOnly
    amount {
      ...ModuleFeeAmountFields
      __typename
    }
    __typename
  }
  ... on TimedFeeCollectModuleSettings {
    type
    endTimestamp
    referralFee
    contractAddress
    followerOnly
    amount {
      ...ModuleFeeAmountFields
      __typename
    }
    __typename
  }
  ... on MultirecipientFeeCollectModuleSettings {
    type
    contractAddress
    amount {
      ...ModuleFeeAmountFields
      __typename
    }
    optionalCollectLimit: collectLimit
    referralFee
    followerOnly
    optionalEndTimestamp: endTimestamp
    recipients {
      recipient
      split
      __typename
    }
    __typename
  }
  __typename
}

fragment ModuleFeeAmountFields on ModuleFeeAmount {
  asset {
    symbol
    decimals
    address
    __typename
  }
  value
  __typename
}

fragment StatsFields on PublicationStats {
  totalUpvotes
  totalAmountOfMirrors
  totalAmountOfCollects
  totalAmountOfComments
  __typename
}

fragment MetadataFields on MetadataOutput {
  name
  content
  image
  attributes {
    traitType
    value
    __typename
  }
  cover {
    original {
      url
      __typename
    }
    __typename
  }
  media {
    original {
      url
      mimeType
      __typename
    }
    __typename
  }
  encryptionParams {
    accessCondition {
      or {
        criteria {
          ...SimpleConditionFields
          and {
            criteria {
              ...SimpleConditionFields
              __typename
            }
            __typename
          }
          or {
            criteria {
              ...SimpleConditionFields
              __typename
            }
            __typename
          }
          __typename
        }
        __typename
      }
      __typename
    }
    __typename
  }
  __typename
}

fragment SimpleConditionFields on AccessConditionOutput {
  nft {
    contractAddress
    chainID
    contractType
    tokenIds
    __typename
  }
  eoa {
    address
    __typename
  }
  token {
    contractAddress
    amount
    chainID
    condition
    decimals
    __typename
  }
  follow {
    profileId
    __typename
  }
  collect {
    publicationId
    thisPublication
    __typename
  }
  __typename
}

fragment CommentFields on Comment {
  id
  profile {
    ...ProfileFields
    __typename
  }
  reaction(request: $reactionRequest)
  mirrors(by: $profileId)
  hasCollectedByMe
  onChainContentURI
  isGated
  canComment(profileId: $profileId) {
    result
    __typename
  }
  canMirror(profileId: $profileId) {
    result
    __typename
  }
  canDecrypt(profileId: $profileId) {
    result
    reasons
    __typename
  }
  collectModule {
    ...CollectModuleFields
    __typename
  }
  stats {
    ...StatsFields
    __typename
  }
  metadata {
    ...MetadataFields
    __typename
  }
  hidden
  createdAt
  appId
  commentOn {
    ... on Post {
      ...PostFields
      __typename
    }
    ... on Comment {
      id
      profile {
        ...ProfileFields
        __typename
      }
      reaction(request: $reactionRequest)
      mirrors(by: $profileId)
      hasCollectedByMe
      onChainContentURI
      isGated
      canComment(profileId: $profileId) {
        result
        __typename
      }
      canMirror(profileId: $profileId) {
        result
        __typename
      }
      canDecrypt(profileId: $profileId) {
        result
        reasons
        __typename
      }
      collectModule {
        ...CollectModuleFields
        __typename
      }
      metadata {
        ...MetadataFields
        __typename
      }
      stats {
        ...StatsFields
        __typename
      }
      mainPost {
        ... on Post {
          ...PostFields
          __typename
        }
        ... on Mirror {
          ...MirrorFields
          __typename
        }
        __typename
      }
      hidden
      createdAt
      __typename
    }
    ... on Mirror {
      ...MirrorFields
      __typename
    }
    __typename
  }
  __typename
}

fragment MirrorFields on Mirror {
  id
  profile {
    ...ProfileFields
    __typename
  }
  reaction(request: $reactionRequest)
  hasCollectedByMe
  isGated
  canComment(profileId: $profileId) {
    result
    __typename
  }
  canMirror(profileId: $profileId) {
    result
    __typename
  }
  canDecrypt(profileId: $profileId) {
    result
    reasons
    __typename
  }
  collectModule {
    ...CollectModuleFields
    __typename
  }
  stats {
    ...StatsFields
    __typename
  }
  metadata {
    ...MetadataFields
    __typename
  }
  hidden
  mirrorOf {
    ... on Post {
      ...PostFields
      __typename
    }
    ... on Comment {
      id
      profile {
        ...ProfileFields
        __typename
      }
      collectNftAddress
      reaction(request: $reactionRequest)
      mirrors(by: $profileId)
      onChainContentURI
      isGated
      canComment(profileId: $profileId) {
        result
        __typename
      }
      canMirror(profileId: $profileId) {
        result
        __typename
      }
      canDecrypt(profileId: $profileId) {
        result
        reasons
        __typename
      }
      stats {
        ...StatsFields
        __typename
      }
      createdAt
      __typename
    }
    __typename
  }
  createdAt
  appId
  __typename
}
`

export const getProfile = `
  query Profile($id: ProfileId!) {
    profile(request: { profileId: $id }) {
      id
      name
      bio
      picture {
        ... on MediaSet {
          original {
            url
          }
        }
      }
      handle
    }
  }
`

export const getProfileByHandle = `
  query Profile($handle: Handle!) {
    profile(request: { handle: $handle }) {
      id
      name
      bio
      picture {
        ... on MediaSet {
          original {
            url
          }
        }
      }
      handle
    }
  }
`