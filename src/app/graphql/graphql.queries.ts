import { gql } from "apollo-angular";


const GET_ALL_ORGS = gql`
query {
  all_orgs {
    orgs {
      ... on SDO {
      id
      username
      sfdc_id
      name
      pwd
      org_created_date
      org_expiry
      instance_url
      created_date
      is_bookmarked
      shared_to
      is_owner
      instance_name
      logo
      notes {
        id
        note
      }
      tags {
        id
        tag
      }
      state
      shared_from
      type
      last_sign_in_date
      trailforce_id
      is_deleted
      key_identifier
      org_exp_type
      key_name
      org_edition
      }
      ... on IDO {
      id
      username
      sfdc_id
      name
      pwd
      instance_name
      org_created_date
      org_expiry
      instance_url
      created_date
      is_bookmarked
      shared_to
      is_owner
      logo
      notes {
        id
        note
      }
      tags {
        id
        tag
      }
      state
      shared_from
      type
      last_sign_in_date
      trailforce_id
      is_deleted
      key_identifier
      org_exp_type
      key_name
      org_edition
      }
      ... on CDO {
      id
      username
      sfdc_id
      name
      pwd
      instance_name
      org_created_date
      org_expiry
      instance_url
      created_date
      is_bookmarked
      shared_to
      is_owner
      logo
      notes {
        id
        note
      }
      tags {
        id
        tag
      }
      state
      shared_from
      type
      last_sign_in_date
      trailforce_id
      is_deleted
      key_identifier
      org_exp_type
      key_name
      org_edition
      }
      ... on EDO {
      id
      email
      name
      pwd
      instance_url
      is_bookmarked
      type
      shared_from
      shared_to
      is_owner
      notes {
        id
        note
      }
      tags {
        id
        tag
      }
      state
      created_at
      created_date
      username
      }
      ... on Miscellaneous {
      id
      username
      sfdc_id
      name
      pwd
      instance_name
      org_created_date
      org_expiry
      instance_url
      created_date
      is_bookmarked
      shared_to
      is_owner
      logo
      notes {
        id
        note
      }
      tags {
        id
        tag
      }
      state
      shared_from
      type
      last_sign_in_date
      trailforce_id
      is_deleted
      key_identifier
      org_exp_type
      key_name
      org_edition
      }
      ... on ZSC {
      id
      email
      name
      pwd
      account
      object_id
      is_owner
      shared_to
      instance_url
      shared_from
      created_date
      state
      notes {
        id
        note
      }
      tags {
        id
        tag
      }
      username
      type
      created_date
      is_bookmarked
      }
      ... on ZSMC {
      id
      email
      name
      pwd
      account
      object_id
      is_owner
      instance_url
      shared_to
      shared_from
      created_date
      state
      notes {
        id
        note
      }
      tags {
        id
        tag
      }
      username
      type
      created_date
      is_bookmarked
      }
      ... on MCDO {
      id
      mid
      type
      name
      pwd
      email
      is_bookmarked
      last_sign_in_date
      shared_from
      shared_to
      is_owner
      instance_url
      notes {
        id
        note
      }
      tags {
        id
        tag
      }
      username
      state
      created_at
      created_date
      }
    }
    userErrors {
      message
    }
  }
}`


export { GET_ALL_ORGS };