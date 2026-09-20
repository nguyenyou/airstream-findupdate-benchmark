ThisBuild / scalaVersion := "3.3.3"
ThisBuild / version := "0.1.0"

lazy val commonSettings = Seq(
  scalaJSUseMainModuleInitializer := false,
  scalaJSLinkerConfig ~= (_.withSourceMap(false))
)

lazy val before = project
  .in(file("before"))
  .enablePlugins(ScalaJSPlugin)
  .settings(commonSettings)
  .settings(
    name := "airstream-findupdate-before"
  )

lazy val after = project
  .in(file("after"))
  .enablePlugins(ScalaJSPlugin)
  .settings(commonSettings)
  .settings(
    name := "airstream-findupdate-after"
  )
