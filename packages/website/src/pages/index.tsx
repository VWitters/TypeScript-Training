import * as React from 'react';
import { Link, graphql } from 'gatsby';

import Bio from '../components/bio';
import Layout from '../components/layout';
import SEO from '../components/seo';
import { rhythm } from '../utils/typography';

interface IBlogIndexProps {
  data: {
    allMarkdownRemark: {
      edges: {
        node: {
          excerpt: string;
          frontmatter: { title: string; date: string; description: string };
          fields: { slug: string };
        };
      }[];
    };
    site: {
      siteMetadata: {
        title: string;
        courses: {
          id: string;
          title: string;
          summary: string;
        }[];
      };
    };
  };
  location: {
    pathname: string;
  };
}

const BlogIndex: React.FunctionComponent<IBlogIndexProps> = ({
  data,
  location,
}) => {
  const siteTitle = data.site.siteMetadata.title;
  const courses = data.site.siteMetadata.courses;
  // const posts = data.allMarkdownRemark.edges;

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="Courses" />
      <Bio />
      {courses.map(({ title, id, summary }) => {
        return (
          <article key={id}>
            <header>
              <h3
                style={{
                  marginBottom: rhythm(1 / 4),
                }}
              >
                <Link style={{ boxShadow: `none` }} to={`course/${id}`}>
                  {title}
                </Link>
              </h3>
            </header>
            <section>
              <p>{summary}</p>
            </section>
          </article>
        );
      })}
    </Layout>
  );
};

export default BlogIndex;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        courses {
          id
          title
          summary
        }
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
          }
        }
      }
    }
  }
`;
