import Authenticate from "./Authenticate"

export default function page() {
  return (
    <>
    <Authenticate/>
    </>
  )
}
export function generateMetadata(){
  return{
    title:"xfery | authenticate"
  }
}
