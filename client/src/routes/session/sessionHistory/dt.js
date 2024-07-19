// {
//   sessions.length > 0 ? (
//     sessions.map((session) => (
//       <div className="sessionHistory__session" key={session.id}>
//         <h3 className="sessionHistory__session__title">{session.title}</h3>
//         {session.posts?.map((post) => (
//           <div key={post.id}>
//             <p>
//               <strong>Title:{post.post.title}</strong>{' '}
//             </p>
//             <div className="imageHolder">
//               {' '}
//               {post.post.images.map((img, index) => (
//                 <img key={index} src={img} alt="image" />
//               ))}
//             </div>
//           </div>
//         ))}
//         <br />
//         <hr />
//       </div>
//     ))
//   ) : (
//     <p>No sessions found.</p>
//   );
// }
