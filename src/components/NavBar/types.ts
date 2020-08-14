export interface INavBarProps {
  user: {
    attributes: {
      name: String
    }
  } | null;
  userLoading: Boolean
}
