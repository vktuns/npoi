using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(NPOI.Web.Startup))]
namespace NPOI.Web
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
