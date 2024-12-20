import {Link as LinkTo} from 'react-router-dom'

type LinkProps = {
    to: string
    name: string
    className?: string|null
}

const Link = ({to, name, className=""}: LinkProps) => {
  return (
    <span className={`text-white ${className}`}>
        <LinkTo to={to}>{name}</LinkTo>
    </span>
  )
}

export default Link