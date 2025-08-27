import gql from "graphql-tag";

const ToggleDebugMode = gql`
  mutation ToggleDebugMode($toggleDebugModeInput: ToggleDebugModeInput!) {
    toggleDebugMode(toggleDebugModeInput: $toggleDebugModeInput) {
      id
      debugModeEnabled
    }
  }
`;

export default ToggleDebugMode;