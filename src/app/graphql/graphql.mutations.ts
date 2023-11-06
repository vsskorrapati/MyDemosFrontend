import { gql } from "apollo-angular";

const UPDATE_CDO = gql`
mutation($cdo: CDOUpdateInput!, $cdoUpdateId: String!){
  cdoUpdate(cdo: $cdo, id: $cdoUpdateId) {
    cdo {
      id
      is_bookmarked
      pwd
    }
    userErrors {
      message
    }
  }
}
`

const UPDATE_SDO = gql`
mutation($sdo: SDOUpdateInput!, $sdoUpdateId: String!){
  sdoUpdate(sdo: $sdo, id: $sdoUpdateId) {
    sdo {
      id
      username
      is_bookmarked
      pwd
    }
    userErrors {
      message
    }
  }
}
`

const UPDATE_IDO = gql`
mutation($ido: IDOUpdateInput!, $idoUpdateId: String!){
  idoUpdate(ido: $ido, id: $idoUpdateId) {
    ido {
      id
      is_bookmarked
      pwd
    }
    userErrors {
      message
    }
  }
}
`

const UPDATE_MISC = gql`
mutation($misc: MiscUpdateInput!, $miscUpdateId: String!){
  miscUpdate(misc: $misc, id: $miscUpdateId) {
    misc {
      id
      is_bookmarked
      pwd
    }
    userErrors {
      message
    }
  }
}
`

const UPDATE_MCDO = gql`
mutation($mcdo: MCDOUpdateInput!, $mcdoUpdateId: String!) {
  mcdoUpdate(mcdo: $mcdo, id: $mcdoUpdateId) {
    mcdo {
      id
      is_bookmarked
      pwd
    }
    userErrors {
      message
    }
  }
}
`

const UPDATE_ZSC = gql`
mutation($zsc: ZSCUpdateInput!, $zscUpdateId: String!){
  zscUpdate(zsc: $zsc, id: $zscUpdateId) {
    zsc {
      id
      is_bookmarked
      pwd
    }
    userErrors {
      message
    }
  }
}
`

const UPDATE_ZSMC = gql`
mutation($zsmc: ZSMCUpdateInput!, $zsmcUpdateId: String!){
    zsmcUpdate(zsmc: $zsmc, id: $zsmcUpdateId) {
      zsmc {
        id
        is_bookmarked
        pwd
      }
      userErrors {
        message
      }
    }
  }
`

const UPDATE_EDO = gql`
mutation($edo: EDOUpdateInput!, $edoUpdateId: String!) {
  edoUpdate(edo: $edo, id: $edoUpdateId) {
    edo {
      id
      is_bookmarked
      pwd
    }
    userErrors {
      message
    }
  }
}
`

const CREATE_NOTE = gql`
mutation($notes: NoteInput!) {
  noteCreate(notes: $notes) {
    notes {
      id
      note
      orgtype
      organization_id
    },
    userErrors {
      message
    }
  }
}
`

const UPDATE_NOTE = gql`
mutation($notes: NoteUpdateInput!, $noteUpdateId: String!){
  noteUpdate(notes: $notes, id: $noteUpdateId) {
    notes {
      id
      note
      orgtype
    }
    userErrors {
      message
    }
  }
}
`

const DELETE_NOTE = gql`
mutation($noteDeleteId: String!) {
  noteDelete(id: $noteDeleteId) {
    notes {
      id
      note
      orgtype
    }
    userErrors {
      message
    }
  }
}
`

export { UPDATE_CDO, UPDATE_SDO, UPDATE_IDO, UPDATE_MISC, UPDATE_ZSC, UPDATE_MCDO, UPDATE_ZSMC, UPDATE_EDO, CREATE_NOTE, UPDATE_NOTE, DELETE_NOTE }