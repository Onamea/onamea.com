import type { FunctionComponent } from "preact"

const About: FunctionComponent = () => {
  return (
    <div class="py-4">
      <h3>About</h3>
      <p>
        A protocol to encode vanity names within public keys. Using emoji characters to create a fingerprint. Allowing for unique names, where duplicates (conflicting pairs of name & fingerprint) will be exponentially hard to brute force. In addition a CRDT is available to create and sign a distributed dataset for defining a Web of Trust and general data graphs.
      </p>
      <p class="href-wrap">
        <a href="https://github.com/onamea/docs/blob/main/onamea.md">https://github.com/onamea/docs/blob/main/onamea.md</a>
      </p>
      <p>
        Bitcoin donations: bc1q7tgk2ecfgsqle35lyfxzgnkqe56txts0jsznzc
      </p>
    </div>
  )
}

export default About
