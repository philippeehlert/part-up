export type Email = {
    address: string;
    verified: boolean;
}

export interface Location {
  city: string;
  lat: number;
  lng: number;
  place_id: string;
  country: string;
}

export interface Profile {
  name: string;
  normalized_name: string,
  settings: {
    locale: string,
    optionalDetailsCompleted: boolean,
    email: {
      dailydigest: boolean,
      upper_mentioned_in_partup: boolean,
      upper_mentioned_in_network_chat: boolean,
      invite_upper_to_partup_activity: boolean,
      invite_upper_to_network: boolean,
      partup_created_in_network: boolean,
      partups_networks_new_pending_upper: boolean,
      partups_networks_accepted: boolean,
      partups_new_comment_in_involved_conversation: boolean,
      partups_networks_new_upper: boolean,
      partups_networks_upper_left: boolean
    },
    unsubscribe_email_token: string
  },
  image?: string,
  description?: string,
  tags: Array<string>,
  location: Location,
  facebook_url?: string,
  twitter_url?: string,
  instagram_url?: string,
  linkedin_url?: string,
  phonenumber?: string,
  website?: string,
  skype?: string,
  meurs: {
    portal: string,
    nl_id: string,
    en_id: string,
    program_session_id: number,
    fetched_results: boolean,
    results: Array<{
      code: number,
      name: string,
      score: number,
      zscore: number,
      dscore: number,
      highIndex: number
    }>
  },
  tiles: Array<string>
}

export interface User {
  _id: string
  emails: Array<Email>
  profile: Profile,
  _version: number
}
