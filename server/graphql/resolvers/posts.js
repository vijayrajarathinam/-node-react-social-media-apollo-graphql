const Post = require('../../models/Post');
const checkAuth = require('../../utils/auth');
const { AuthenticationError, UserInputError } = require('apollo-server');

module.exports = {
    Query: {
        async getPosts(){
            try{ return await Post.find().sort({ createdAt: -1 }); }
            catch(err){ throw new Error(err); }
        },
        async getPost(_,{ postId }){
            try{ 
                const post = await Post.findById(postId); 
                if(post) return post;
                else throw new Error("Post not found");
            } catch(err){ throw new Error(err); }
        }
    },
    Mutation: {
        async createPost(_,{ body }, context){
            const user = checkAuth(context);
            if(body.trim() === '') throw new Error('Post body must not be empty');

            const newPost = new Post({
                body,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString()
            })

            return await newPost.save();
        },
        async deletePost(_,{ postId }, context){
            const { username } = checkAuth(context);
            try{
                const post = await Post.findById(postId);
                if(username == post.username){
                    await post.delete();
                    return "Post deleted successfully";
                }else throw new AuthenticationError('Action not allowed');                
            }catch(err){
                throw new Error(err)
            }
        },
        async likePost(_,{ postId }, context){
            const { username } = checkAuth(context);
            const post = await Post.findById(postId);

            if(post) {
                if( post.likes.find(like => like.username === username)) post.likes = post.likes.filter(like => like.username !== username);
                else post.likes.push({ username, createdAt: new Date().toISOString() })
            
                return await post.save()
            } else throw new UserInputError('Post not found'); 
        }
    }
}