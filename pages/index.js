import { signIn, signOut, useSession } from 'next-auth/react'
import Box from "../components/Box";
import Text from "../components/Text";
import Link from "next/link";

const PublicLanding = ({ name, allowRegister }) => {
  const { data: session } = useSession()

  return (
    <Box
      minHeight="calc(100vh - 173px)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      <Text as="h1" fontSize={6} textAlign="center" lineHeight={1.2}>
        Friend Sparks
      </Text>
      <Box display="flex" mt={4}>
        <Box>
          <Link href="/login">
            LogIn
          </Link>
        </Box>
        <Box ml={4}>
            <Link href="/register">
              Register
            </Link>
          </Box>
        </Box>
    </Box>
  );
}

const Index = ({
  token,
  latestSparks,
  latestAnnouncement,
  emailVerified,
}) => {
  const {session} = useSession()
  if (!session)
    return (
      <>
        <PublicLanding/>
      </>
    );

  const handleSearch = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const query = form.get("query");
    if (query) router.push(`/search/${encodeURIComponent(query)}`);
  };

  const { getLocaleString } = useContext(LocaleContext);

  return (
    <>
      <Text as="h1" mb={5}>
        {getLocaleString("navHome")}
      </Text>
      {!emailVerified && (
        <Infobox mb={5}>
          <Text icon={ErrorCircle} iconColor="error">
            {getLocaleString("indexText1")}
          </Text>
        </Infobox>
      )}
      {latestAnnouncement && (
        <Link href={`/announcements/${latestAnnouncement.slug}`} passHref>
          <Box
            as="a"
            _css={{
              "&:hover": {
                textDecoration: "none",
                h2: { textDecoration: "underline" },
              },
            }}
          >
            <Infobox mb={5}>
              <Text
                icon={News}
                iconColor="primary"
                color="grey"
                fontWeight={600}
                fontSize={1}
                _css={{ textTransform: "uppercase" }}
                mb={3}
              >
                {getLocaleString("indexLatestAnnounce")}
              </Text>
              <Text as="h2" fontSize={3} mb={3}>
                {latestAnnouncement.title}
              </Text>
              <Text color="grey">
                {getLocaleString("reqPosted")}{" "}
                {moment(latestAnnouncement.created).format(
                  `${getLocaleString("indexTime")}`
                )}{" "}
                {getLocaleString("reqBy")}{" "}
                {latestAnnouncement.createdBy?.username ? (
                  <Link
                    href={`/user/${latestAnnouncement.createdBy.username}`}
                    passHref
                  >
                    <a>{latestAnnouncement.createdBy.username}</a>
                  </Link>
                ) : (
                  "deleted user"
                )}
              </Text>
            </Infobox>
          </Box>
        </Link>
      )}
      <Box as="form" onSubmit={handleSearch} display="flex" mb={5}>
        <Input
          placeholder={getLocaleString("indexSearchSparks")}
          name="query"
          mr={3}
          required
        />
        <Button>{getLocaleString("indexSearch")}</Button>
      </Box>
      <Text as="h2" mb={4}>
        {getLocaleString("indexLatestSparks")}
      </Text>
    </>
  );
};

export default Index;