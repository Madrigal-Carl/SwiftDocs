import WelcomeBanner from "./WelcomeBanner";

export default function Content({ onChangeTab }) {
  return (
    <div>
      <WelcomeBanner onChangeTab={onChangeTab} />
    </div>
  );
}
